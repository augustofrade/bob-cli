import { ArgumentsCamelCase } from "yargs";
import BobServer from "../core/BobServer";
import getAbsolutePath from "../helpers/get-absolute-path";

interface ServeCommandArgs {
  port: number;
  directory?: string;
}

export default function serveCommand(args: ArgumentsCamelCase<ServeCommandArgs>) {
  const absolutePath = getAbsolutePath(args.directory ?? "");

  new BobServer(absolutePath).listen(args.port);
}
