import fs from "fs";
import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import BobLogger from "../BobLogger";
import BobWebSocket from "../BobWebSocket";
import injectWebSocketClientScript from "../BobWebSocket/inject-web-socket-script";
import mimeTypes from "./mime-types";

/**
 * Handles HTTP requests for BobServer.
 */
export default class BobServerRequestHandler {
  private logger: BobLogger = BobLogger.Instance;
  public bobWebSocket?: BobWebSocket;

  public constructor(private directory: string) {}

  /**
   * Handles incoming HTTP requests from BobServer.
   *
   * It resolves the requested file path based on the request URL, checks if the file exists,
   *   and serves the file with the appropriate MIME type.
   */
  public handleRequest(req: IncomingMessage, res: ServerResponse) {
    try {
      const relativePath = this.resolveFilePath(req.url);
      const filePath = relativePath ? path.join(this.directory, relativePath) : undefined;

      console.log("");
      this.logger.logInfo(`Incoming request URL: ${req.url}`);
      this.logger.logDebug(`Resolved file path: ${filePath ?? "Invalid path"}`);

      if (filePath === undefined) {
        return this.handleRedirect(res, "/");
      }

      this.handleFileRequest(res, filePath);
    } catch (error) {
      this.logger.logInfo(`Invalid request: ${error}`);
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("400 Bad Request");
    }
  }

  /**
   * Handles redirection to a specified location.
   */
  private handleRedirect(res: ServerResponse, location: string) {
    this.logger.logDebug(`Redirecting to ${location}`);
    res.writeHead(302, { Location: location });
    res.end();
  }

  /**
   * Handles the file request by reading the file and sending it in the response.
   *
   * Should only be called if the filePath is valid.
   */
  private handleFileRequest(res: ServerResponse, filePath: string) {
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
        return;
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 Internal Server Error");
          return;
        }

        const extension = path.extname(filePath) as unknown as keyof typeof mimeTypes;
        if (extension === ".html") {
          data = this.handleHtmlFile(data);
        }

        res.writeHead(200, { "content-type": this.getMimeType(extension) });
        res.end(data);
      });
    });
  }

  /**
   * Gets the MIME type for a given file extension.
   * @returns The MIME type as a string.
   */
  private getMimeType(fileExtension: keyof typeof mimeTypes): string {
    return mimeTypes[fileExtension] || "text/html";
  }

  /**
   * Resolves the file path from the request URL.
   * @param requestUrl - The URL from the request.
   * @returns The file path or undefined if invalid. Defaults folder directories to "\<directory\>/index.html".
   */
  private resolveFilePath(requestUrl?: string): string | undefined {
    if (!requestUrl || requestUrl === "/") {
      return "index.html";
    }

    requestUrl = decodeURIComponent(requestUrl);

    if (requestUrl.includes("..") || requestUrl.includes("~")) {
      return undefined;
    }

    if (requestUrl.endsWith("/") || path.extname(requestUrl) === "") {
      return path.join(requestUrl, "index.html");
    }

    return requestUrl;
  }

  /**
   * Handles HTML files by injecting the WebSocket client script if a WebSocket server is available.
   *
   * May be extended for other purposes.
   * @param data The HTML file content as a Buffer.
   * @returns The modified HTML content as a Buffer.
   */
  private handleHtmlFile(data: Buffer): Buffer {
    if (this.bobWebSocket === undefined) {
      return data;
    }

    const htmlString = data.toString("utf8");
    const modifiedHtml = injectWebSocketClientScript(htmlString, this.bobWebSocket.port);
    return Buffer.from(modifiedHtml, "utf8");
  }
}
