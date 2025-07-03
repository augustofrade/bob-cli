import { ArgumentsCamelCase } from "yargs";
import ActionManager from "../core/ActionManager";
import listLearntActions from "../helpers/listtLearntActions";

interface DoCommandArgs {
  action_name?: string;
}

export default async function doCommand(args: ArgumentsCamelCase<DoCommandArgs>) {
  const learntActions = await ActionManager.Instance.getlLearntActions();

  if (!args.action_name) {
    console.log("You need to specify an action name for me to execute.");
    return listLearntActions();
  }

  if (learntActions[args.action_name]) {
    console.log(`I don't know how to do ${args.action_name} yet.`);
    console.log("You can teach me how to do it with the 'learn' command.");
    return await listLearntActions();
  }
}
