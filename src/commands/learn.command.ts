import { ArgumentsCamelCase } from "yargs";
import ActionManager from "../core/ActionManager";
import { BobActionType } from "../types/BobAction";

export default async function learnCommand(args: ArgumentsCamelCase<LearnCommandArgs>) {
  const actionManager = ActionManager.Instance;
  const learntActions = await actionManager.getlearntActions();
  if (learntActions[args.action_name]) {
    console.error(`I've already learnt the action "${args.action_name}"!\n`);
    return;
  }

  try {
    await actionManager.saveLearntAction({
      actionName: args.action_name,
      content: args.content,
      type: args.type,
      description: args.description,
    });
    console.log(`I've learnt the action "${args.action_name}" of the type ${args.type}!\n`);
  } catch (error) {
    console.error(
      `Something happened while I tried learning the action "${args.action_name}".\n\n`
    );
    console.log(error);
  }
}

interface LearnCommandArgs {
  action_name: string;
  content: string;
  type: BobActionType;
  description?: string;
}
