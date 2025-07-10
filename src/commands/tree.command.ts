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
}

export default function treeCommand(args: ArgumentsCamelCase<TreeCommandArgs>) {
  const rootDir = args.directory || process.cwd();

  readDir(rootDir, {
    depth: args.depth,
    identationSize: args.identationSize,
    identationChar: args.identationChar,
    showHidden: args.showHidden,
    showFiles: args.showFiles,
  });
}

type RecursiveDirInfo = Omit<TreeCommandArgs, "rootDir">;

function readDir(directory: string, info: RecursiveDirInfo, level = 0) {
  const content = fs.readdirSync(directory, { withFileTypes: true });
  const identation = info.identationChar.repeat(level * info.identationSize);

  const spaceBetween = level > 0 ? " " : "";
  content.forEach((element) => {
    const displayName = `${identation}${spaceBetween}${element.name}`;
    if (!info.showHidden && element.name.startsWith(".")) return;

    if (element.isDirectory()) {
      console.log(chalk.bold(displayName));
      readDir(path.join(directory, element.name), info, level + 1);
    } else {
      console.log(displayName);
    }
  });
}
