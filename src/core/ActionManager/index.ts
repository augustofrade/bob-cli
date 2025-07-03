import { join } from "path";
import { BobActionCollection, CreateBobAction } from "../../types/BobAction";
import JsonFS from "../JsonFS";

export default class ActionManager {
  public static instance: ActionManager;
  private static readonly learntActionsFile = join(__dirname, "../../../data/learntActions.json");
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
    const learntActions = await this.getlearntActions();
    learntActions[action.actionName] = {
      content: action.content,
      type: action.type,
      description: action.description,
      learntAt: new Date(),
    };

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
