import fs from "fs/promises";
import { extname, join } from "path";
import getAbsolutePath from "../../helpers/get-absolute-path";
import BobLogger from "../BobLogger";

/**
 * Yields all the provided file paths by leveraging them.
 * Ex: [style.css, styles/] -> [style.css, styles/home.css, styles/modal.css]
 * @param paths
 */
const logger = BobLogger.Instance;

export async function* iterateFiles(paths: string[]) {
  const hasValidExtension = (filename: string) => {
    const extension = extname(filename);
    if (extension !== ".css") {
      logger.logError("Invalid file type, found: " + extension + "\n");
      return false;
    }
    return true;
  };

  const abs = getAbsolutePath;

  for (let path of paths) {
    try {
      let fullPath = abs(path);
      const pathStats = await fs.stat(fullPath);
      if (pathStats.isFile()) {
        logger.logDebug("Handling file " + path);
        if (!hasValidExtension(path)) continue;
        yield fullPath;
      }
      if (pathStats.isDirectory()) {
        logger.logVerbose("Reading directory " + path);
        const pathFiles = await fs.readdir(abs(path), { withFileTypes: true, recursive: true });
        for (let pathFile of pathFiles) {
          logger.logDebug("Handling file " + pathFile.name);
          if (!pathFile.isFile()) continue;
          if (!hasValidExtension(pathFile.name)) continue;
          yield join(pathFile.parentPath, pathFile.name);
        }
      }
    } catch (error) {
      logger.logError((error as Error).message);
    }
  }
}
