import ActionManager from "../core/ActionManager";

export default async function listLearntActions() {
  const actions = await ActionManager.Instance.getLearntActionsArray();
  if (actions.length === 0) {
    console.log("I haven't learnt any actions yet. You can teach me something new with");
    console.log("bob learn <action_name> <content> --type <type>\n");
    console.log("For more information, run 'bob learn --help'.");
    return;
  }

  console.log("\nHere's what I know how to do:");
  actions.forEach((action) => {
    if (action.description)
      console.log(`- ${action.actionName}\n    Description:  ${action.description}`);
    else console.log(`- ${action.actionName}`);
  });
  console.log("\nYou can ask me to do a learnt action by running 'bob do <action_name>'.");
}
