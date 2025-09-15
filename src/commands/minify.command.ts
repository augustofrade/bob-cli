import fs from "fs/promises";
import { basename, extname, join } from "path";
import { ArgumentsCamelCase } from "yargs";
import BobLogger from "../core/BobLogger";
import getAbsolutePath from "../helpers/get-absolute-path";

interface MinifyCommandArgs {
  files: string[];
  outputDir: string | undefined;
}

const logger = BobLogger.Instance.setLogLevel(2);

export default async function minifyCommand(args: ArgumentsCamelCase<MinifyCommandArgs>) {
  for await (let path of iterateFiles(args.files)) {
    await handleFile(path);
  }
}

async function handleFile(path: string) {
  let content = await fs.readFile(path, "utf-8");

  content = minifyFile(content);

  const filename = basename(path, ".css");
  const resultFilename = filename + ".min.css";
  logger.logInfo(`Minified ${filename}.css to ${resultFilename}`);
}

function minifyFile(content: string): string {
  content = content
    .replace(/\n/g, "")
    .replace(/\/\*.*\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{;:,])\s*/g, "$1")
    .replace(/;}/g, "}");
  return content;
}

async function* iterateFiles(paths: string[]) {
  const hasValidExtension = (filename: string) => {
    const extension = extname(filename);
    if (extension !== ".css") {
      logger.logError("Invalid file type, found: " + extension);
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
