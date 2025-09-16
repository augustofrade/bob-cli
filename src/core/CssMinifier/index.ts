import fs from "fs/promises";
import { basename } from "path";
import { iterateFiles } from "./iterate-files";
import { DoneFn, EachFn, HandleFilesOptions, MinifiedFile } from "./types";

/**
 * Handy wrapper for CSS Minification process
 */
export class CssMinifier {
  private eachFn?: EachFn;
  private doneFn?: DoneFn;

  constructor() {}

  public each(callback: EachFn): this {
    this.eachFn = callback;
    return this;
  }

  public done(callback: DoneFn): this {
    this.doneFn = callback;
    return this;
  }

  public async handle(options: HandleFilesOptions): Promise<void> {
    if (!this.eachFn) throw new Error("'eachFn' callback not provided");

    const { output, files } = options;

    let filesHandled = 0;
    for await (let path of iterateFiles(files)) {
      await this.handleFile(path).then((file) => this.eachFn!(options, file));
      filesHandled++;
    }

    if (this.doneFn) await this.doneFn(output, filesHandled);
  }

  /**
   * Handles the file minification and name resolving
   * @param path File Path
   * @returns
   */
  private async handleFile(path: string): Promise<MinifiedFile> {
    let content = await fs.readFile(path, "utf-8");

    content = this.minifyFile(content);

    const filename = basename(path, ".css");
    const resultFilename = filename + ".min.css";
    return {
      content,
      basename: filename + ".css",
      resultFilename,
    };
  }

  /**
   * Minifies the CSS file content
   * @param content Original ontent of the file
   * @returns Minified content
   */
  private minifyFile(content: string): string {
    content = content
      .replace(/\n/g, "")
      .replace(/\/\*.*\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{;:,])\s*/g, "$1")
      .replace(/;}/g, "}")
      .trim();
    return content;
  }
}
