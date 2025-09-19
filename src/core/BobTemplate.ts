import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import getAbsolutePath from "../helpers/get-absolute-path";
import shortId from "../helpers/short-id";
import { BobActionSpecification } from "../types/BobAction";
import ActionManager from "./ActionManager";

/**
 * Bob Template (action type) related operations
 */
export default class BobTemplate {
  private constructor() {}

  /**
   * Saves a template originating from an action,
   * meaning that if a template action content is being replaced with a new template,
   * the old one should as well be removed
   * @param sourceFilePath
   * @param bobAction
   * @returns The name of the copied file with a random ID prefix
   */
  public static async saveFromAction(sourceFilePath: string, bobAction?: BobActionSpecification) {
    if (bobAction?.type === "template" && existsSync(this.templatePath(bobAction.content))) {
      await fs.rm(this.templatePath(bobAction.content));
    }

    return this.save(sourceFilePath);
  }

  /**
   * Saves the file of the passed path to Bob's data directory and deletes a template if it exists
   * @param sourceFilePath
   * @returns The name of the copied file with a random ID prefix
   */
  public static async save(sourceFilePath: string): Promise<string> {
    try {
      const fileContent = await fs.readFile(sourceFilePath);
      const newFilename = shortId() + "-" + path.basename(sourceFilePath);
      const newPath = this.templatePath(newFilename);
      await fs.writeFile(newPath, fileContent);

      return newFilename;
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Error(`No such file or directory: '${sourceFilePath}'`);
      } else if (error.code === "EACCES") {
        throw new Error(`No permission to read '${sourceFilePath}'`);
      }
      throw new Error("Unknown error");
    }
  }

  /**
   * Copies the template content to the destination path.
   * If no destination path is passed, the file will be created in the current working directory
   * with the name of the original file the template was created from
   * @param source
   * @param dest
   * @returns The name of the created file and the file name of the template
   */
  public static async copyTemplate(source: string, dest?: string): Promise<[string, string]> {
    const parsedSourceFilename = source.slice(4);
    const sourcePath = path.join(ActionManager.templatesDir, source);

    let filename = parsedSourceFilename;
    if (dest) {
      const destDir = path.dirname(dest);
      if (destDir !== ".") await fs.mkdir(destDir, { recursive: true });
      filename = dest;
    }
    const output = getAbsolutePath(filename);

    await fs.copyFile(sourcePath, output);

    return [filename, parsedSourceFilename];
  }

  public static async remove(templateName: string): Promise<void> {
    try {
      const templatePath = this.templatePath(templateName);
      const template = await fs.stat(templatePath);
      const callback = template.isFile() ? fs.rm : fs.rmdir;
      return callback(templatePath);
    } catch {
      // file/dir does not exist, does not matter
    }
  }

  public static async read(templateName: string): Promise<string> {
    try {
      return await fs.readFile(this.templatePath(templateName), "utf8");
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Error("Couldn't find a template for the provided action");
      }
      throw new Error("Unknown error");
    }
  }

  static templatePath(filename: string) {
    return path.join(ActionManager.templatesDir, filename);
  }
}
