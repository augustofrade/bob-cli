import { existsSync } from "fs";
import { ArgumentsCamelCase } from "yargs";
import BobLogger from "../core/BobLogger";
import { BobLogLevel } from "../core/BobLogger/BobLogLevel";
import BobServer from "../core/BobServer";
import getAbsolutePath from "../helpers/get-absolute-path";

interface ServeCommandArgs {
  port: number;
  directory?: string;
  open: boolean;
  watch: boolean;
  logLevel: string;
}

export default function serveCommand(args: ArgumentsCamelCase<ServeCommandArgs>) {
  const absolutePath = getAbsolutePath(args.directory ?? "");
  if (!existsSync(absolutePath))
    return BobLogger.Instance.logError(`Directory not found: '${absolutePath}'`);

  args.logLevel = args.logLevel.toUpperCase();
  const logLevel = BobLogLevel[args.logLevel as any] as unknown as number;

  BobLogger.Instance.setLogLevel(logLevel);

  new BobServer(absolutePath).listen(args.port, {
    openInBrowser: args.open,
    watch: args.watch,
  });
}
