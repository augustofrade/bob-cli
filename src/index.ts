import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import learnCommand from "./commands/learn.command";

yargs(hideBin(process.argv))
  .scriptName("bob")
  .usage("Usage: $0 <command> [options]")
  .command(
    "learn <action_name> <content>",
    "Learns something new to do",
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
          default: ["text"],
          choices: ["text", "file", "dir", "script", "qr"],
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
    ["tellme", "list", "$0"],
    "the default command",
    () => {},
    (argv) => {
      console.log("default command");
    }
  )
  .version(false)
  .help().argv;
