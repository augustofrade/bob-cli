import { exec, spawn } from "child_process";
import fs from "fs";
import { platform } from "os";
import encodeQR from "qr";
import { BobActionData, BobActionType } from "../../types/BobAction";
import BobTemplate from "../BobTemplate";
import ScriptHandler from "../ScriptHandler";

type BobDoFn = (action: BobActionData, argv: string[]) => Promise<string>;

export default class ActionHandler {
  private static handlers: Record<BobActionType, BobDoFn> = {
    file: this.handleFileAction,
    text: this.handleTextualAction,
    dir: this.handleTextualAction,
    "list-dir": this.handleListDirAction,
    script: this.handleScriptAction,
    qr: this.handleQrAtion,
    open: this.handleOpenAction,
    alias: this.handleAliasAction,
    template: this.handleTemplateAction,
  };

  public static handle(action: BobActionData, argv: string[]): Promise<string> {
    const handler = this.handlers[action.type];
    if (!handler) {
      return Promise.reject(`I don't know how to do actions of the type ${action.type}`);
    }
    return handler(action, argv);
  }

  private static handleTextualAction(action: BobActionData, argv: string[]): Promise<string> {
    return new Promise((resolve) => {
      console.log(action.content);
      resolve(action.content);
    });
  }

  private static handleScriptAction(action: BobActionData, argv: string[]): Promise<string> {
    if (!fs.existsSync(action.content))
      return Promise.reject(`Script not found: ${action.content}`);

    const scriptHandler = new ScriptHandler(action.content);
    const runnerFound = scriptHandler.withFileRunner();
    if (!runnerFound) {
      return Promise.reject(
        `Couldn't find a command runner found for file of extension "${scriptHandler.fileExtension}"`
      );
    }

    const command = scriptHandler.withArgv(argv).getCommand();

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(error || stderr);
        }
        console.log(stdout);
        resolve(stdout);
      });
    });
  }

  private static handleAliasAction(action: BobActionData, argv: string[]): Promise<string> {
    const argvString = argv.map((arg) => (arg.includes(" ") ? `"${arg}"` : arg)).join(" ");
    const command = `${action.content} ${argvString}`;

    return new Promise(async (resolve, reject) => {
      const child = spawn(command, { shell: true });
      for await (const data of child.stdout) {
        console.log(data.toString());
      }
      resolve("");
    });
  }

  private static handleOpenAction(action: BobActionData, argv: string[]): Promise<string> {
    const platformCommand = platform() === "win32" ? "start" : "open";
    return new Promise((resolve, reject) => {
      exec(`${platformCommand} ${action.content}`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(error || stderr);
        }
        console.log(stdout);
        resolve(stdout);
      });
    });
  }

  private static handleFileAction(action: BobActionData, argv: string[]): Promise<string> {
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

  private static handleQrAtion(action: BobActionData, argv: string[]): Promise<string> {
    return new Promise((resolve) => {
      const ascii = encodeQR(action.content, "term");
      console.log(ascii);
      resolve(ascii);
    });
  }

  private static handleListDirAction(action: BobActionData, argv: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readdir(action.content, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error(`Something happened while reading the specified directory\n`);
          return reject(err);
        }
        files.forEach((file) => {
          console.log(`${file.isDirectory() ? "DIR" : "   "}  ${file.name}`);
        });
        resolve(action.content);
      });
    });
  }

  private static handleTemplateAction(action: BobActionData, argv: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      BobTemplate.copyTemplate(action.content, argv[0])
        .then(([filename, parsedSourceFilename]) => {
          console.log(`Created ${filename} from template ${parsedSourceFilename}`);
          resolve("");
        })
        .catch((err) => reject(err));
    });
  }
}
