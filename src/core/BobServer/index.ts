import fs from "fs";
import http, { ServerResponse } from "http";
import path from "path";
import BobLogger from "../BobLogger";
import mimeTypes from "./mime-types";

export default class BobServer {
  private logger: BobLogger = BobLogger.Instance;

  constructor(private directory: string) {}

  public listen(port: number) {
    console.log(`Serving directory ${this.directory}`);

    const server = http.createServer((req, res) => {
      try {
        const relativePath = this.resolveFilePath(req.url);
        const filePath = relativePath ? path.join(this.directory, relativePath) : undefined;

        this.logger.logInfo(`Incoming request URL: ${req.url}`);
        this.logger.logDebug(`Resolved file path: ${filePath ?? "Invalid path"}\n`);

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
      console.log(`Server is running at http://localhost:${port}\n`);
    });
  }

  private handleRedirect(res: ServerResponse, location: string) {
    this.logger.logDebug(`Redirecting to ${location}\n`);
    res.writeHead(302, { Location: location });
    res.end();
  }

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

  private getMimeType(ext: keyof typeof mimeTypes): string {
    return mimeTypes[ext] || "text/html";
  }

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
