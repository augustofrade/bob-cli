import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import doCommand from "./commands/do.command";
import helloCommand from "./commands/hello.command";
import learnCommand from "./commands/learn.command";

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
