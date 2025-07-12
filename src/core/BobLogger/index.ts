import chalk from "chalk";
import { BobLogLevel } from "./BobLogLevel";

/**
 * Provides logging functionality.
 *
 * Being a singleton class, the log level can be set anywhere to control the verbosity of the logs.
 */
export default class BobLogger {
  private static instance: BobLogger;
  private logLevel: BobLogLevel = BobLogLevel.INFO;

  private constructor() {}

  /**
   * Logs independent of the log level.
   */
  public logInfo(message: string): void {
    console.log(chalk.gray(`[INFO]     ${message}`));
  }

  /**
   * Logs if log level >= BobLogLevel.DEBUG
   */
  public logDebug(message: string): void {
    if (this.logLevel >= BobLogLevel.DEBUG) {
      console.log(`[DEBUG]    ${message}`);
    }
  }

  /**
   * Logs if log level is set to the maximum allowed level, BobLogLevel.VERBOSE
   */
  public logVerbose(message: string): void {
    if (this.logLevel == BobLogLevel.VERBOSE) {
      console.log(`[VERBOSE]  ${message}`);
    }
  }

  /**
   * Logs independent of the log level.
   */
  public logError(message: string): void {
    console.error(chalk.red(`[ERROR]    ${message}`));
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
