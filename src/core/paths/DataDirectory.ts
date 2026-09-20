import fs from "fs";
import { DataPaths } from ".";

/**
 * Handles the creation and removal of Bob's data directory
 */
export class DataDirectory {
  /**
   * Creates all neccessary directories and files for Bob to properly function if they don't exist.
   * @returns Whether the actions file was created.
   */
  public static createAllIfNotExists(): boolean {
    fs.mkdirSync(DataPaths.templatesDir, { recursive: true });

    if (fs.existsSync(DataPaths.dataFilePath)) return false;

    fs.writeFileSync(DataPaths.dataFilePath, "{}", "utf-8");
    return true;
  }

  /**
   * Deletes the data directory
   */
  public static delete() {
    fs.rmSync(DataPaths.getDirectory(), { recursive: true, force: true });
  }
}
