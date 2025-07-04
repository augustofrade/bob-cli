import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import doCommand from "./commands/do.command";
import helloCommand from "./commands/hello.command";
import learnCommand from "./commands/learn.command";
import qrCommand from "./commands/qr.command";
import regexCommand from "./commands/regex.command";
import ActionManager from "./core/ActionManager";

try {
  const knowledgeNotFound = ActionManager.Instance.init();
  if (knowledgeNotFound) {
    console.log("I didnt't find my knowledge base. Setting everything up...\n");
  }
  main();
} catch {
  console.log("Something happened while setting up my knowledge base. Please try again.");
}

function main() {
  yargs(hideBin(process.argv))
    .scriptName("bob")
    .usage("Usage: $0 <command> [options]")
    .command(
      "learn <action_name> <content>",
      "BOB Learns something new to do",
      (yargs) => {
        return yargs
          .positional("action_name", {
            describe: "Name of the action",
            type: "string",
          })
          .positional("content", {
            describe: "Content of the action",
            type: "string",
          })
          .option("type", {
            describe: "Type of the content",
            type: "string",
            default: "text",
            choices: ["text", "file", "dir", "list-dir", "script", "qr"],
          })
          .option("force", {
            alias: "f",
            describe: "Force learning the action even if BOB has already learnt it",
            type: "boolean",
            default: false,
          })
          .example(
            "bob learn say_hello 'Hello, World!'",
            "Learns a new action named 'say_hello' with content 'Hello, World!'\n"
          )
          .example(
            "bob learn teddies_folder ./teddies",
            "Learns a new action named 'teddies_folder' with the complete full path of './teddies' directory"
          );
      },
      learnCommand
    )
    .command(
      "do [action_name]",
      "BOB Executes a learnt action",
      (yargs) => {
        return yargs
          .positional("action_name", {
            describe: "Name of the action to execute",
            type: "string",
          })
          .example("bob do say_hello", "Executes the 'say_hello' action");
      },
      doCommand
    )
    .command(
      "qr <content>",
      "BOB generates a QR code for the given content",
      (yargs) => {
        return yargs
          .positional("content", {
            describe: "Content to encode in the QR code",
            type: "string",
          })
          .option("output", {
            alias: "o",
            describe: "Output file to save the QR code image",
            type: "string",
          })
          .example(
            "bob qr 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'",
            "Generates a QR code for the provided content"
          );
      },
      qrCommand
    )
    .command(
      "regex <pattern> [content]",
      "BOB tests a regex pattern against the provided content.",
      (yargs) => {
        return yargs
          .positional("pattern", {
            describe: "Regex pattern to test",
            type: "string",
          })
          .positional("content", {
            describe:
              "Content that BOB will test against the regex pattern. If not provided, BOB will read from stdin.",
            type: "string",
          })
          .option("flags", {
            alias: "f",
            describe: "Regex flags to be used (e.g., 'g' for global, 'i' for case-insensitive)",
            type: "string",
          })
          .option("all", {
            alias: "a",
            describe: "Returns the whole regex result instead of just the matches",
            type: "boolean",
            default: false,
          });
      },
      regexCommand
    )
    .command(
      ["tellme", "list", "$0"],
      "the default command",
      () => {},
      (argv) => {
        console.log("default command");
      }
    )
    .command("hello", "BOB greets you", () => {}, helloCommand)
    .version(false)
    .help().argv;
}
