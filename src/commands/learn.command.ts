import { ArgumentsCamelCase } from "yargs";
import DataManager from "../core/DataManager";
import { BobAction } from "../types/BobAction";

export default async function learnCommand(args: ArgumentsCamelCase<LearnCommandArgs>) {
  const dataManager = DataManager.Instance;

  dataManager.saveLearntAction({
    action_name: args.action_name,
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
