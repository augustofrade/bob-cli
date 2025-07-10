import ActionManager from "../core/ActionManager";

export default async function clearCommand() {
  console.log("Wash day. Memory's clear, right?");

  try {
    await ActionManager.Instance.deleteAllLearntActions();
    console.log("My memory has been cleared!");
  } catch {
    console.log("Failed to delete learnt actions.");
  }
}
