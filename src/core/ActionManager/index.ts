import { BobActionData, CreateBobAction } from "../../types/BobAction";
import JsonFS from "../JsonFS";

export default class ActionManager {
  public static instance: ActionManager;
  private static readonly learntActionsFile = "learntActions.json";
  private learntActions: Array<BobActionData> = [];

  private constructor() {}

  public getlearntActions(): Promise<Array<BobActionData>> {
    return new Promise((resolve, reject) => {
      if (this.learntActions.length > 0) {
        return resolve(this.learntActions);
      }

      JsonFS.read<BobActionData[]>(ActionManager.learntActionsFile)
        .then((data) => {
          this.learntActions = data || [];
          resolve(this.learntActions);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public saveLearntAction(action: CreateBobAction): Promise<void> {
    const data: BobActionData = {
      ...action,
      learntAt: new Date(),
    };
    this.learntActions.push(data);

    return JsonFS.write(ActionManager.learntActionsFile, data);
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
