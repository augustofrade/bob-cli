import fs from "fs";
import { BobActionData, BobActionType } from "../../types/BobAction"

export default class ActionHandler {
  private static handlers: Record<BobActionType, (action: BobActionData) => Promise<void>> = {
    file: this.handleFileAction,
    text: this.handleTextualAction,
    dir: this.handleTextualAction,
    script: this.handleTextualAction,
    qr: this.handleTextualAction,
  }


  public static handle(action: BobActionData): Promise<void> {
    const handler = this.handlers[action.type];
    if (!handler) {
      throw new Error(`I don't know how to do actions of the type ${action.type}`);
    }
    return handler(action);

  }

  private static handleTextualAction(action: BobActionData): Promise<void> {
    return new Promise((resolve) => {
      console.log(action.content);
      console.log("\n");
      resolve();
    });
  }

  private static handleFileAction(action: BobActionData): Promise<void> {
    return new Promise(async (resolve, reject) => {
      fs.readFile(action.content, "utf-8", (err, data) => {
        if (err) {
          console.error(`Something happened while reading the specified file\n`);
          return reject(err);
        }
        console.log(data);
        resolve();
      });
    });
  }
}