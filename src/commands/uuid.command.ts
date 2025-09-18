import { randomUUID } from "node:crypto";
import { ArgumentsCamelCase } from "yargs";

interface UuidCommandArgs {
  noCache: boolean;
}

export default function uuidCommand(args: ArgumentsCamelCase<UuidCommandArgs>) {
  console.log(randomUUID({ disableEntropyCache: args.noCache }));
}
