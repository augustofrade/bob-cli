import { ArgumentsCamelCase } from "yargs";

export default function defaultCommand(args: ArgumentsCamelCase<{ command?: string }>) {
  let msg = "Try using 'bob help' for general help or 'bob tellme' for learnt actions";
  if (args.command !== undefined) {
    msg = "I don't know how to do that. " + msg;
  }

  console.log(msg);
}
