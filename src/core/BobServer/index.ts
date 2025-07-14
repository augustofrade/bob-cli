import { exec } from "child_process";
import fs from "fs";
import http from "http";
import { platform } from "os";
import BobLogger from "../BobLogger";
import BobWebSocket from "../BobWebSocket";
import { BobServerOptions } from "./BobServerOptions";
import BobServerRequestHandler from "./RequestHandler";

/**
 * Singleton class that serves static files from a specified directory.
 */
export default class BobServer {
  private requestHandler: BobServerRequestHandler;
  private logger = BobLogger.Instance;
  private bobWebSocket?: BobWebSocket;

  constructor(private directory: string) {
    this.requestHandler = new BobServerRequestHandler(this.directory);
  }

  /**
   * Starts the server and listens on the specified port.
   * @param port The port number to listen on.
   */
  public listen(port: number, options?: BobServerOptions) {
    console.log(`Serving directory ${this.directory}`);

    this.handleWatchMode(port, options?.watch ?? false);

    const server = http.createServer(this.requestHandler.handleRequest.bind(this.requestHandler));

    const address = `http://localhost:${port}`;

    server.listen(port, () => {
      console.log(`Server is running at ${address}`);
      if (options?.openInBrowser) {
        const platformCommand = platform() === "win32" ? "start" : "open";
        exec(`${platformCommand} ${address}`);
      }
    });

    server.on("error", (e: any) => {
      if (e.code === "EADDRINUSE") {
        this.logger.logError(`Port ${port} already in use.`);
      }
    });
  }

  /**
   * Handles watch mode for the server. Acts just as a wrapper to enable or disable directory watching.
   *
   * @param port Port specified by the user for the server to listen on.
   * @param watchDirectory Whether to enable watch mode for the directory.
   */
  private handleWatchMode(port: number, watchDirectory: boolean) {
    if (watchDirectory) {
      this.watchDirectory(this.directory, port);
      this.requestHandler.bobWebSocket = this.bobWebSocket;
    }
  }

  /**
   * Watches the specified directory for changes and sends a "refresh" message to connected clients
   * through websocket when a change in any files within the directory is detected.
   */
  private watchDirectory(directory: string, port: number) {
    this.logger.logDebug(`Watching directory: ${directory}`);

    this.bobWebSocket = new BobWebSocket(port + 1).listen();

    fs.watch(this.directory, { recursive: true }, (eventType, filename) => {
      if (eventType === "change" && filename) {
        this.logger.logDebug(`File changed: ${filename}. Reloading...`);
        this.bobWebSocket!.sendMessage("reload");
      }
    });
  }
}
