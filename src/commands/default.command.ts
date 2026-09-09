import { ArgumentsCamelCase } from "yargs";
import ActionManager from "../core/ActionManager";
import { runAction } from "./do.command";

export default async function defaultCommand(args: ArgumentsCamelCase<{ command?: string }>) {
  let msg = "Try using 'bob help' for general help or 'bob tellme' for learnt actions";
  if (args.command === undefined) {
    console.log(msg);
    return;
  }

  const learntActions = await ActionManager.Instance.getLearntActions();
  const action = learntActions[args.command];
  if (!action) {
    msg = "I don't know how to do that. " + msg;
    console.log(msg);
    return;
  }

  runAction({
    actionName: args.command,
    ...action,
  });
}
