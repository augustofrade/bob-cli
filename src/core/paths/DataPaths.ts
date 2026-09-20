import os from "os";
import { join } from "path";

/**
 * Paths used by the CLI for R/W operations
 */
export class DataPaths {
  private static readonly TEMPLATES_DIR_PATH: string = "templates";
  private static readonly DATA_FILE_PATH: string = "bob-data.json";

  private static dir?: string;

  /**
   * @returns The full path of the data directory
   */
  public static getDirectory(): string {
    if (this.dir) return this.dir;

    const homedir = os.homedir();
    let dir = join(homedir, ".bob-cli");

    if (os.platform() === "win32") {
      const appdataDir = process.env.LOCALAPPDATA ?? join(os.homedir(), "AppData", "Local");
      dir = join(appdataDir, "bob-cli");
    }

    this.dir = dir;

    return dir;
  }

  public static get dataFilePath(): string {
    return join(this.getDirectory(), this.DATA_FILE_PATH);
  }

  public static get templatesDir(): string {
    return join(this.getDirectory(), this.TEMPLATES_DIR_PATH);
  }
}
