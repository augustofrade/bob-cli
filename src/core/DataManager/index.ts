import { BobActionData, CreateBobAction } from "../../types/BobAction";
import JsonFS from "../JsonFS";

export default class DataManager {
  public static instance: DataManager;
  private static readonly learntActionsFile = "learntActions.json";
  private learntActions: Array<BobActionData> = [];

  private constructor() {}

  public getlearntActions(): Promise<Array<BobActionData>> {
    return new Promise((resolve, reject) => {
      if (this.learntActions.length > 0) {
        return resolve(this.learntActions);
      }

      JsonFS.read<BobActionData[]>(DataManager.learntActionsFile)
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

    return JsonFS.write(DataManager.learntActionsFile, data);
  }

  /**
   * Singleton instance of DataManager
   * @returns {DataManager} The singleton instance of DataManager
   */
  public static get Instance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }
}
