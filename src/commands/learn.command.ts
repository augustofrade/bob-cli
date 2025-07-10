import { ArgumentsCamelCase } from "yargs";
import ActionManager from "../core/ActionManager";
import getAbsolutePath from "../helpers/get-absolute-path";
import { BobActionType } from "../types/BobAction";

import fs from "fs";

interface LearnCommandArgs {
  action_name: string;
  content: string;
  type: BobActionType;
  description?: string;
  force: boolean;
}

export default async function learnCommand(args: ArgumentsCamelCase<LearnCommandArgs>) {
  args.action_name = args.action_name.trim().replace(/\s+/g, "-");
  const actionManager = ActionManager.Instance;
  const learntActions = await actionManager.getLearntActions();
  const alreadyLearnt = learntActions[args.action_name] !== undefined;

  if (alreadyLearnt) {
    if (!args.force) {
      console.error(`I have already learnt the action "${args.action_name}"!\n`);
      return;
    }
    console.log(`Updating knowledge of the action "${args.action_name}"...\n`);
  }

  const fsActionTypes: BobActionType[] = ["dir", "file", "script", "list-dir"];
  if (fsActionTypes.includes(args.type)) {
    args.content = getAbsolutePath(args.content);
  } else if (args.type === "open") {
    args.content = handleOpenActionContent(args.content);
  }

  try {
    await actionManager.saveLearntAction({
      actionName: args.action_name,
      content: args.content,
      type: args.type,
      description: args.description,
    });
    console.log(getSuccessMessage(args.action_name, args.type, alreadyLearnt));
  } catch (error) {
    console.error(
      `Something happened while I tried learning the action "${args.action_name}".\n\n`
    );
    console.log(error);
  }
}

function getSuccessMessage(
  actionName: string,
  type: BobActionType,
  alreadyLearnt: boolean
): string {
  if (alreadyLearnt) return `I have updated my knowledge of the action "${actionName}"!\n`;
  return `I have learnt the action "${actionName}" of the type ${type}!\n`;
}

/**
 * Checks if the content of the action is a valid file or directory.
 * If not, it will be treated as a URL.
 * @param content content of the action
 * @returns
 * - absolute path of the file/directory if it exists in the filesystem OR
 * - a URL with a HTTP protocol
 */
function handleOpenActionContent(content: string): string {
  const path = getAbsolutePath(content);
  if (fs.existsSync(path)) {
    const pathStats = fs.statSync(content);
    if (pathStats.isFile() || pathStats.isDirectory()) {
      return path;
    }
  }
  const hasProtocol = content.startsWith("http://") || content.startsWith("https://");
  if (!hasProtocol) content = `http://${content}`;
  return content.replace(/\s/gi, "%20");
}
