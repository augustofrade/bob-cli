import { ArgumentsCamelCase } from "yargs";
import ActionManager from "../core/ActionManager";

interface ForgetCommandArgs {
  action_name: string;
}

export default async function forgetCommand(args: ArgumentsCamelCase<ForgetCommandArgs>) {
  const deleted = await ActionManager.Instance.deleteLearntAction(args.action_name);
  if (deleted) {
    console.log(`I've forgotten the action "${args.action_name}"`);
    return;
  }
  console.log(`I haven't learnt the action "${args.action_name}", therefore I can't forget it!`);
}
