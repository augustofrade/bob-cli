import fs from "fs";
import http from "http";
import path from "path";
import mimeTypes from "./mime-types";

export default class BobServer {
  constructor(private directory: string) {}

  public listen(port: number) {
    console.log(`Serving directory ${this.directory}`);

    const server = http.createServer((req, res) => {
      const filePath = path.join(this.directory, this.getDirectoryIndex(req.url));
      console.log("url: ", req.url);
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
    });

    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  }

  private getMimeType(ext: keyof typeof mimeTypes): string {
    return mimeTypes[ext] || "text/html";
  }

  private getDirectoryIndex(requestUrl?: string): string {
    console.log("Incoming request URL: ", requestUrl);

    if (requestUrl === undefined || requestUrl === "/") {
      return "index.html";
    }
    return requestUrl;
  }
}
