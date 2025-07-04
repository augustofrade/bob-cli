import { ArgumentsCamelCase } from "yargs";

interface RegexCommandArgs {
  pattern: string;
  content?: string;
  flags?: string;
}

export default function regexCommand(args: ArgumentsCamelCase<RegexCommandArgs>) {
  const content = getContent(args.content);
  const regexFlags = getRegexFlags(args.flags);

  const regex = new RegExp(args.pattern, regexFlags);
  let result = regex.exec(content);
  if (!result) {
    console.log("No match found.");
    return;
  }
  console.log("Match found:");
  console.log(result);
}

function getContent(content?: string): string {
  if (content) {
    return content;
  }

  const stdinContent = require("fs").readFileSync(0, "utf-8");
  return stdinContent.trim();
}

function getRegexFlags(flags?: string): string {
  if (!flags) {
    return "";
  }

  const validFlags = flags.split("").filter((flag) => "gimsuy".includes(flag));
  return validFlags.join("");
}
