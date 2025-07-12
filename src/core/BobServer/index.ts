import { exec } from "child_process";
import http from "http";
import { platform } from "os";
import BobLogger from "../BobLogger";
import BobServerRequestHandler from "./RequestHandler";

/**
 * Singleton class that serves static files from a specified directory.
 */
export default class BobServer {
  private requestHandler: BobServerRequestHandler;
  private logger = BobLogger.Instance;

  constructor(private directory: string) {
    this.requestHandler = new BobServerRequestHandler(this.directory);
  }

  /**
   * Starts the server and listens on the specified port.
   * @param port The port number to listen on.
   */
  public listen(port: number, openInBrowser: boolean) {
    console.log(`Serving directory ${this.directory}`);

    const server = http.createServer(this.requestHandler.handleRequest.bind(this.requestHandler));

    const address = `http://localhost:${port}`;

    server.listen(port, () => {
      console.log(`Server is running at ${address}`);
      if (openInBrowser) {
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
}
