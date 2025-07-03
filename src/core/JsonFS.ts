import fs from "fs";

export default class JsonFS {
  public static read<T>(path: string): Promise<T> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const jsonData: T = JSON.parse(data);
          resolve(jsonData);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  public static readSync<T>(path: string): T {
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data) as T;
  }

  public static write<T>(path: string, data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(data, null, 2), "utf8", (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  public static writeSync<T>(path: string, data: T): void {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
  }
}
