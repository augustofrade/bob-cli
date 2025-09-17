import fs from "fs/promises";
import { join } from "path";
import getAbsolutePath from "../../helpers/get-absolute-path";
import BobLogger from "../BobLogger";

/**
 * Yields all the provided file paths by leveraging them.
 * Ex: [style.css, styles/] -> [style.css, styles/home.css, styles/modal.css]
 * @param paths
 */
const logger = BobLogger.Instance;

function hasValidExtension(filename: string) {
  return !filename.endsWith(".min.css") && filename.endsWith(".css");
}

export async function* iterateFiles(paths: string[]) {
  for (let path of paths) {
    try {
      let fullPath = getAbsolutePath(path);
      const pathStats = await fs.stat(fullPath);

      if (pathStats.isFile() && hasValidExtension(path)) {
        logger.logDebug("Handling file " + path);
        yield fullPath;
      }

      if (pathStats.isDirectory()) {
        logger.logVerbose("Reading directory " + path);
        const nestedFiles = await fs.readdir(getAbsolutePath(path), {
          withFileTypes: true,
          recursive: true,
        });

        for (let nestedFile of nestedFiles) {
          if (!nestedFile.isFile() || !hasValidExtension(nestedFile.name)) continue;
          logger.logDebug("Handling file " + nestedFile.name);
          yield join(nestedFile.parentPath, nestedFile.name);
        }
      }
    } catch (error) {
      logger.logError((error as Error).message);
    }
  }
}
