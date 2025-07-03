import { BobActionCollection, BobActionData, CreateBobAction } from "../../types/BobAction";
import JsonFS from "../JsonFS";

export default class ActionManager {
  public static instance: ActionManager;
  private static readonly learntActionsFile = "learntActions.json";
  private learntActions: null | BobActionCollection = null;

  private constructor() {}

  public getlearntActions(): Promise<BobActionCollection> {
    return new Promise((resolve, reject) => {
      if (this.learntActions) {
        return resolve(this.learntActions);
      }

      JsonFS.read<BobActionCollection>(ActionManager.learntActionsFile)
        .then((data) => {
          this.learntActions = data || {};
          resolve(this.learntActions);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async saveLearntAction(action: CreateBobAction): Promise<void> {
    const data: BobActionData = {
      ...action,
      learntAt: new Date(),
    };
    const learntActions = await this.getlearntActions();
    learntActions[data.actionName] = data;

    return JsonFS.write(ActionManager.learntActionsFile, learntActions);
  }

  /**
   * Singleton instance of ActionManager
   * @returns {ActionManager} The singleton instance of ActionManager
   */
  public static get Instance(): ActionManager {
    if (!ActionManager.instance) {
      ActionManager.instance = new ActionManager();
    }
    return ActionManager.instance;
  }
}
