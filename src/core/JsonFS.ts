import fs from "fs/promises";

/**
 * Exposes async R/W operations
 */
export default class JsonFS {
  public static async read<T>(path: string): Promise<T> {
    const data = await fs.readFile(path, "utf8");
    return JSON.parse(data) as T;
  }

  public static async write<T>(path: string, data: T): Promise<void> {
    await fs.writeFile(path, JSON.stringify(data, null, 2), "utf8");
  }
}
