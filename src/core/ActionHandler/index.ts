import fs from "fs";
import { BobActionData, BobActionType } from "../../types/BobAction";

export default class ActionHandler {
  private static handlers: Record<BobActionType, (action: BobActionData) => Promise<string>> = {
    file: this.handleFileAction,
    text: this.handleTextualAction,
    dir: this.handleTextualAction,
    script: this.handleTextualAction,
    qr: this.handleTextualAction,
  };

  public static handle(action: BobActionData): Promise<string> {
    const handler = this.handlers[action.type];
    if (!handler) {
      throw new Error(`I don't know how to do actions of the type ${action.type}`);
    }
    return handler(action);
  }

  private static handleTextualAction(action: BobActionData): Promise<string> {
    return new Promise((resolve) => {
      console.log(action.content);
      console.log("\n");
      resolve(action.content);
    });
  }

  private static handleFileAction(action: BobActionData): Promise<string> {
    return new Promise(async (resolve, reject) => {
      fs.readFile(action.content, "utf-8", (err, data) => {
        if (err) {
          console.error(`Something happened while reading the specified file\n`);
          return reject(err);
        }
        console.log(data);
        resolve(action.content);
      });
    });
  }
}
