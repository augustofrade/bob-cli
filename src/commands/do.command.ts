import { ArgumentsCamelCase } from "yargs";
import ActionHandler from "../core/ActionHandler";
import ActionManager from "../core/ActionManager";
import listLearntActions from "../helpers/listLearntActions";
import { BobActionData } from "../types/BobAction";
interface DoCommandArgs {
  action_name?: string;
}

export default async function doCommand(args: ArgumentsCamelCase<DoCommandArgs>) {
  const learntActions = await ActionManager.Instance.getLearntActions();

  if (!args.action_name) {
    console.log("You need to specify an action name for me to execute.");
    return await listLearntActions();
  }

  const action: undefined | Omit<BobActionData, "actionName"> = learntActions[args.action_name];

  if (!action) {
    console.log(`I don't know how to do ${args.action_name} yet.`);
    console.log("You can teach me how to do it with the 'learn' command.");
    return await listLearntActions();
  }

  runAction({
    actionName: args.action_name,
    ...action,
  });
}

export function runAction(action: BobActionData) {
  ActionHandler.handle(action, process.argv.slice(4)).catch((e) => {
    console.error(`Something happened while I tried doing the action:\n\n${e.message}.\n`);
  });
}
