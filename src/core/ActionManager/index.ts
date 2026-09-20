import fs from "fs/promises";
import { BobActionCollection, BobActionData, CreateBobAction } from "../../types/BobAction";
import BobTemplate from "../BobTemplate";
import JsonFS from "../JsonFS";
import { DataPaths } from "../paths";

export default class ActionManager {
  private static instance: ActionManager;
  private learntActions: null | BobActionCollection = null;

  private constructor() {}

  public async getLearntActions(): Promise<BobActionCollection> {
    if (this.learntActions) return this.learntActions;

    const data = await JsonFS.read<BobActionCollection>(DataPaths.dataFilePath);
    this.learntActions = data || {};
    return data;
  }

  public async getLearntActionsArray(): Promise<BobActionData[]> {
    const learntActions = await this.getLearntActions();
    return Object.entries(learntActions).map(([actionName, action]) => ({
      actionName,
      content: action.content,
      type: action.type,
      description: action.description,
      learntAt: action.learntAt,
    }));
  }

  public hasLearntAction(actionName: string): Promise<boolean> {
    return this.getLearntActions().then((learntActions) => {
      return learntActions[actionName] !== undefined;
    });
  }

  public async saveLearntAction(action: CreateBobAction): Promise<void> {
    const learntActions = await this.getLearntActions();
    learntActions[action.actionName] = {
      content: action.content,
      type: action.type,
      description: action.description,
      learntAt: new Date(),
    };

    JsonFS.write(DataPaths.dataFilePath, learntActions);
  }

  public async deleteLearntAction(actionName: string): Promise<boolean> {
    const learntActions = await this.getLearntActions();
    const action = learntActions[actionName];
    const actionExists = action !== undefined;

    if (actionExists && action.type === "template") {
      await BobTemplate.remove(action.content);
    }

    delete learntActions[actionName];
    await JsonFS.write(DataPaths.dataFilePath, learntActions);
    return actionExists;
  }

  public async deleteAllLearntActions(): Promise<void> {
    await fs.writeFile(DataPaths.dataFilePath, "{}", "utf8");
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
