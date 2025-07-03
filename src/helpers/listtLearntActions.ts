import ActionManager from "../core/ActionManager";

export default async function listLearntActions() {
  console.log("\nHere's what I know how to do:");
  const actions = await ActionManager.Instance.getLearntActionsArray();
  actions.forEach((action) => {
    if (action.description)
      console.log(`- ${action.actionName}\n    Description:  ${action.description}`);
    else console.log(`- ${action.actionName}`);
  });
}
