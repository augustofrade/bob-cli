import { ArgumentsCamelCase } from "yargs";
import ActionManager from "../core/ActionManager";
import { BobActionType } from "../types/BobAction";

interface LearnCommandArgs {
  action_name: string;
  content: string;
  type: BobActionType;
  description?: string;
  force: boolean;
}

export default async function learnCommand(args: ArgumentsCamelCase<LearnCommandArgs>) {
  const actionManager = ActionManager.Instance;
  const learntActions = await actionManager.getlearntActions();
  const alreadyLearnt = learntActions[args.action_name] !== undefined;

  if (alreadyLearnt) {
    if (!args.force) {
      console.error(`I have already learnt the action "${args.action_name}"!\n`);
      return;
    }
    console.log(`Updating knowledge of the action "${args.action_name}"...\n`);
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
