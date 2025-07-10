import chalk from "chalk";
import fs from "fs";
import path from "path";
import { ArgumentsCamelCase } from "yargs";

interface TreeCommandArgs {
  directory?: string;
  depth: number;
  identationSize: number;
  identationChar: string;
  showHidden: boolean;
  showFiles: boolean;
  fullPath: boolean;
}

export default function treeCommand(args: ArgumentsCamelCase<TreeCommandArgs>) {
  const rootDir = args.directory || process.cwd();

  readDir(rootDir, {
    depth: args.depth,
    identationSize: args.identationSize,
    identationChar: args.identationChar,
    showHidden: args.showHidden,
    showFiles: args.showFiles,
    fullPath: args.fullPath,
  });
}

type RecursiveDirInfo = Omit<TreeCommandArgs, "rootDir">;

function readDir(directory: string, info: RecursiveDirInfo, level = 0) {
  const content = fs.readdirSync(directory, { withFileTypes: true });
  const identation = info.identationChar.repeat(level * info.identationSize);

  const spaceBetween = level > 0 ? " " : "";
  content.forEach((element) => {
    if (!info.showHidden && element.name.startsWith(".")) return;

    let displayName: string;
    if (info.fullPath) {
      displayName = `${path.join(directory, element.name)}`;
    } else {
      displayName = `${identation}${spaceBetween}${element.name}`;
    }

    if (!element.isDirectory() && info.showFiles) {
      return console.log(displayName);
    }
    console.log(chalk.bold(displayName));

    if (level < info.depth) {
      readDir(path.join(directory, element.name), info, level + 1);
    }
  });
}
