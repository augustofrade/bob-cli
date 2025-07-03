import { ArgumentsCamelCase } from "yargs";
import ActionManager from "../core/ActionManager";
import { BobAction } from "../types/BobAction";

export default async function learnCommand(args: ArgumentsCamelCase<LearnCommandArgs>) {
  const actionManager = ActionManager.Instance;

  actionManager.saveLearntAction({
    actionName: args.action_name,
    content: args.content,
    type: args.type,
    description: args.description,
  });
}

interface LearnCommandArgs {
  action_name: string;
  content: string;
  type: BobAction;
  description?: string;
}
