import chalk from "chalk";
import { BobLogLevel } from "./BobLogLevel";

export default class BobLogger {
  private static instance: BobLogger;
  private logLevel: BobLogLevel = BobLogLevel.info;

  private constructor() {}

  public logInfo(message: string): void {
    console.log(chalk.gray(`[INFO]     ${message}`));
  }

  public logDebug(message: string): void {
    if (this.logLevel >= BobLogLevel.debug) {
      console.log(`[DEBUG]    ${message}`);
    }
  }

  public logVerbose(message: string): void {
    if (this.logLevel == BobLogLevel.verbose) {
      console.log(`[VERBOSE]  ${message}`);
    }
  }

  public setLogLevel(level: BobLogLevel): this {
    this.logLevel = level;
    return this;
  }

  public static get Instance(): BobLogger {
    if (!BobLogger.instance) {
      BobLogger.instance = new BobLogger();
    }
    return BobLogger.instance;
  }
}
