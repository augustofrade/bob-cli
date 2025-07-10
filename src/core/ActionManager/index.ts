import fs from "fs";
import { join } from "path";
import { BobActionCollection, BobActionData, CreateBobAction } from "../../types/BobAction";
import JsonFS from "../JsonFS";

export default class ActionManager {
  private static instance: ActionManager;
  private static readonly learntActionsDir: string = join(__dirname, "../../../data/");
  private static readonly learntActionsFile = join(this.learntActionsDir, "learntActions.json");
  private learntActions: null | BobActionCollection = null;

  private constructor() {}

  /**
   * Verifies if the data file exists.
   * If the file does not exist, it creates a new one with an empty JSON object.
   * @return Whether a learnt actions file should be created or not.
   */
  public init(): boolean {
    fs.mkdirSync(ActionManager.learntActionsDir, { recursive: true });

    if (fs.existsSync(ActionManager.learntActionsFile)) return false;

    fs.writeFileSync(ActionManager.learntActionsFile, "{}", "utf-8");
    return true;
  }

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

    JsonFS.write(ActionManager.learntActionsFile, learntActions);
  }

  public async deleteLearntAction(actionName: string): Promise<boolean> {
    const learntActions = await this.getlLearntActions();
    const actionExists = (await learntActions[actionName]) !== undefined;
    delete learntActions[actionName];
    await JsonFS.write(ActionManager.learntActionsFile, learntActions);
    return actionExists;
  }

  public async deleteAllLearntActions(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      JsonFS.write(ActionManager.learntActionsFile, "{}")
        .then((_) => resolve(true))
        .catch((err) => {
          console.log(err);
          reject(false);
        });
    });
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
