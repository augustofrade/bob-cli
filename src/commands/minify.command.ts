import fs from "fs/promises";
import path from "path";
import { ArgumentsCamelCase } from "yargs";
import BobLogger from "../core/BobLogger";
import { CssMinifier } from "../core/CssMinifier";
import getAbsolutePath from "../helpers/get-absolute-path";

interface MinifyCommandArgs {
  files: string[];
  output: string | undefined;
  singlefile: boolean;
}

const logger = BobLogger.Instance.setLogLevel(2);

export default async function minifyCommand(args: ArgumentsCamelCase<MinifyCommandArgs>) {
  if (args.singlefile) {
    return await runSingleFileMode(getAbsolutePath(args.output ?? "styles.min.css"), args.files);
  }

  return await runDefaultMode(args.output, args.files);
}

/**
 * Default mode in which all the *.css files are minified into their *.min.css counterpart.
 * @param outputDir Directory defined by the user
 * @param files File paths
 */
async function runDefaultMode(output: string = "", files: string[]) {
  if (output !== "") {
    await fs.mkdir(output, { recursive: true });
    logger.logInfo(`Output directory: ${getAbsolutePath(output)}`);
  }

  const minifier = new CssMinifier();
  minifier
    .each(async (options, file) => {
      const { content, basename, resultFilename } = file;

      const outputPath = getAbsolutePath(path.join(options.output, resultFilename));
      await fs.writeFile(outputPath, content, "utf-8");
      logger.logInfo(`Minified ${basename} to ${resultFilename}`);
    })
    .done((_, filesHandled) => logger.logInfo(`${filesHandled} files minified`))
    .handle({ output, files });
}

/**
 * Single File mode in which all the *.css are bundled into a <output>.min.css file.
 * @param output Output file defined by the user
 * @param files File paths
 */
async function runSingleFileMode(output: string = "styles.min.css", files: string[]) {
  const minifier = new CssMinifier();

  const dir = path.dirname(output);
  if (dir !== ".") {
    await fs.mkdir(dir, { recursive: true });
  }

  let fullContent = "";

  minifier
    .each((_, file) => {
      fullContent += file.content;
    })
    .done(async (output, filesHandled) => {
      await fs.writeFile(getAbsolutePath(output), fullContent, "utf-8");
      logger.logInfo(`Minified and bundled ${filesHandled} files to ${output}`);
    })
    .handle({ output, files });
}
