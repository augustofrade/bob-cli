import fs from "fs";
import http, { ServerResponse } from "http";
import path from "path";
import BobLogger from "../BobLogger";
import mimeTypes from "./mime-types";

/**
 * Singleton class that serves static files from a specified directory.
 */
export default class BobServer {
  private logger: BobLogger = BobLogger.Instance;

  constructor(private directory: string) {}

  /**
   * Starts the server and listens on the specified port.
   * @param port The port number to listen on.
   */
  public listen(port: number) {
    console.log(`Serving directory ${this.directory}`);

    const server = http.createServer((req, res) => {
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
    });

    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
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

        const ext = path.extname(filePath) as unknown as keyof typeof mimeTypes;

        res.writeHead(200, { "content-type": this.getMimeType(ext) });
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
}
