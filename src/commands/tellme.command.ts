import fs from "fs/promises";
import path from "path";
import { ArgumentsCamelCase } from "yargs";
import ActionManager from "../core/ActionManager";
import listLearntActions from "../helpers/listLearntActions";

interface TellmeCommandArgs {
  action_name?: string;
}

export default async function tellmeCommand(args: ArgumentsCamelCase<TellmeCommandArgs>) {
  if (!args.action_name) {
    await listLearntActions();
    return console.log("To know more about a specific action, run 'bob tellme <action_name>'.");
  }

  const learntActions = await ActionManager.Instance.getLearntActions();
  const action = learntActions[args.action_name];
  if (action === undefined) {
    console.log(`I don't know how to do '${args.action_name}'.`);
    console.log(
      `You can teach me how to do it with 'bob learn ${args.action_name} <content> --type <type>'.`
    );
    return;
  }

  if (action.type === "template") {
    const filePath = path.join(ActionManager.templatesDir, action.content);
    action.content = await fs.readFile(filePath, "utf8");
  }

  console.log("Description:  ", action.description || "No description provided.");
  console.log("Type:         ", action.type);
  console.log("Content:\n");
  console.log(action.content);
}
