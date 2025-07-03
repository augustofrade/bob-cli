export default class DataManager {
  public static instance: DataManager;

  private constructor() {}

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
