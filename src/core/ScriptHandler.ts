type ScriptRunner = "bash" | "sh" | "node" | "npx ts-node" | "ruby";

const runners: Record<string, ScriptRunner> = {
  js: "node",
  ts: "npx ts-node",
  sh: "sh",
  rb: "ruby",
};

export default class ScriptHandler {
  private argv: Array<string> = [];
  private runner: string = "";
  public fileExtension: string = "";

  public constructor(private readonly file: string) {}

  public withArgv(argv: string[]): this {
    this.argv = argv.map((arg) => (arg.includes(" ") ? `"${arg}"` : arg));
    return this;
  }

  public getCommand(): string {
    return `${this.runner} ${this.file} ${this.argv.join(" ")}`;
  }

  public handleFileExtension(): boolean {
    const fileSplit = this.file.split(".");
    this.fileExtension = fileSplit[fileSplit.length - 1];
    const runner = runners[this.fileExtension];
    if (!runner) return false;

    this.runner = runner;
    return true;
  }
}
