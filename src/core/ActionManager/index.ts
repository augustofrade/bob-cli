import { join } from "path";
import { BobActionCollection, BobActionData, CreateBobAction } from "../../types/BobAction";
import JsonFS from "../JsonFS";

export default class ActionManager {
  public static instance: ActionManager;
  private static readonly learntActionsFile = join(__dirname, "../../../data/learntActions.json");
  private learntActions: null | BobActionCollection = null;

  private constructor() {}

  public getlLearntActions(): Promise<BobActionCollection> {
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

  public async getLearntActionsArray(): Promise<BobActionData[]> {
    const learntActions = await this.getlLearntActions();
    return Object.entries(learntActions).map(([actionName, action]) => ({
      actionName,
      content: action.content,
      type: action.type,
      description: action.description,
      learntAt: action.learntAt,
    }));
  }

  public hasLearntAction(actionName: string): Promise<boolean> {
    return this.getlLearntActions().then((learntActions) => {
      return learntActions[actionName] !== undefined;
    });
  }

  public async saveLearntAction(action: CreateBobAction): Promise<void> {
    const learntActions = await this.getlLearntActions();
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
