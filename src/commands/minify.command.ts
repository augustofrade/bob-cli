import fs from "fs/promises";
import { basename, dirname, extname, join } from "path";
import { ArgumentsCamelCase } from "yargs";
import BobLogger from "../core/BobLogger";
import getAbsolutePath from "../helpers/get-absolute-path";

interface MinifyCommandArgs {
  files: string[];
  output: string | undefined;
  singlefile: boolean;
}

const logger = BobLogger.Instance.setLogLevel(2);

export default async function minifyCommand(args: ArgumentsCamelCase<MinifyCommandArgs>) {
  if (args.singlefile) {
    return runSingleFileMode(getAbsolutePath(args.output ?? "styles.min.css"), args.files);
  }

  return runDefaultMode(args.output, args.files);
}

/**
 * Default mode in which all the *.css files are minified into their *.min.css counterpart.
 * @param outputDir Directory defined by the user
 * @param files File paths
 */
async function runDefaultMode(outputDir: string | undefined, files: string[]) {
  if (outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    logger.logInfo(`Output directory: ${getAbsolutePath(outputDir)}`);
  } else {
    outputDir = "";
  }

  for await (let path of iterateFiles(files)) {
    const { content, basename, resultFilename } = await handleFile(path);

    const outputPath = getAbsolutePath(join(outputDir, resultFilename));
    await fs.writeFile(outputPath, content, "utf-8");
    logger.logInfo(`Minified ${basename} to ${resultFilename}`);
  }
}

/**
 * Single File mode in which all the *.css are bundled into a <output>.min.css file.
 * @param output Output file defined by the user
 * @param files File paths
 */
async function runSingleFileMode(output: string, files: string[]) {
  const dir = dirname(output);
  if (dir !== ".") {
    await fs.mkdir(dir, { recursive: true });
  }

  let fullContent = "";
  let filesHandled = 0;
  for await (let path of iterateFiles(files)) {
    const { content } = await handleFile(path);
    fullContent += content;
    filesHandled++;
  }

  await fs.writeFile(getAbsolutePath(output), fullContent, "utf-8");
  logger.logInfo(`Minified and bundled ${filesHandled} files to ${output}`);
}

/**
 * Handles the file minification and name resolving
 * @param path File Path
 * @returns
 */
async function handleFile(path: string) {
  let content = await fs.readFile(path, "utf-8");

  content = minifyFile(content);

  const filename = basename(path, ".css");
  const resultFilename = filename + ".min.css";
  return {
    content,
    basename: filename + ".css",
    resultFilename,
  };
}

function minifyFile(content: string): string {
  content = content
    .replace(/\n/g, "")
    .replace(/\/\*.*\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{;:,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
  return content;
}

/**
 * Yields all the provided file paths by leveraging them.
 * Ex: [style.css, styles/] -> [style.css, styles/home.css, styles/modal.css]
 * @param paths
 */
async function* iterateFiles(paths: string[]) {
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
