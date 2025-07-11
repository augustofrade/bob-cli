#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import clearCommand from "./commands/clear.command";
import doCommand from "./commands/do.command";
import forgetCommand from "./commands/forget.command";
import helloCommand from "./commands/hello.command";
import learnCommand from "./commands/learn.command";
import qrCommand from "./commands/qr.command";
import regexCommand from "./commands/regex.command";
import serveCommand from "./commands/serve.command";
import tellmeCommand from "./commands/tellme.command";
import treeCommand from "./commands/tree.command";
import ActionManager from "./core/ActionManager";

try {
  const knowledgeNotFound = ActionManager.Instance.init();
  if (knowledgeNotFound) {
    console.log("Couldn't find my knowledge base. Setting everything up...\n");
  }
  main();
} catch (error) {
  console.log(error);
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
            alias: "t",
            describe: "Type of the content",
            type: "string",
            default: "text",
            choices: ["text", "file", "dir", "list-dir", "script", "qr", "open", "alias"],
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
      "forget <action_name>",
      "BOB forgets a learnt action",
      (yargs) => {
        yargs.positional("action_name", {
          describe: "Name of the action to forget",
          type: "string",
        });
      },
      forgetCommand
    )
    .command("clear", "CLears BOB's memory", () => {}, clearCommand)
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
      "tree [directory]",
      "BOB displays a tree structure of the specified directory within the specified depth",
      (yargs) => {
        yargs
          .positional("directory", {
            describe:
              "Directory to display the tree structure of. Defaults to the current directory.",
            type: "string",
          })
          .option("depth", {
            alias: "d",
            describe: "Depth of the tree structure to display",
            type: "number",
            default: 3,
          })
          .option("identation-size", {
            alias: "i",
            describe: "Size of the displayed identation",
            type: "number",
            default: 2,
          })
          .option("identation-char", {
            alias: "c",
            describe: "Character used to display the identation",
            type: "string",
            default: "-",
          })
          .option("show-hidden", {
            alias: "h",
            describe: "Show hidden files and directories",
            type: "boolean",
            default: false,
          })
          .option("show-files", {
            alias: "f",
            describe: "Show files in the tree structure",
            type: "boolean",
            default: true,
          })
          .option("full-path", {
            alias: "p",
            describe:
              "Show full path of the files and directories. Ignores the 'identation-char' option",
            type: "boolean",
            default: false,
          })
          .example(
            "bob tree",
            "Displays a tree structure of the current directory with default options"
          )
          .example(
            "bob tree ~/Documents -d 2 -i 4 -c '-' -h",
            "Displays a tree structure of the Documents directory with depth of 2, identation size of 4, identation character '-', displaying hidden files"
          );
      },
      treeCommand
    )
    .command(
      "serve [directory]",
      "BOB starts a local server and serves the contents of the specified directory",
      (yargs) => {
        yargs
          .option("directory", {
            alias: "d",
            describe: "Directory to serve the content from. Defaults to the current directory.",
            type: "string",
          })
          .option("port", {
            alias: "p",
            describe: "Port to run the server on",
            type: "number",
            default: 3000,
          })
          .example(
            "bob serve ~/Documents/website -p 8080",
            "Starts a server serving the ~/Documents/website directory on port 8080"
          );
      },
      serveCommand
    )
    .command(
      "tellme [action_name]",
      "Asks BOB about a learnt action",
      (yargs) => {
        yargs.positional("action_name", {
          describe:
            "Name of the action to ask about. If not provided, BOB lists all learnt actions.",
          type: "string",
        });
      },
      tellmeCommand
    )
    .command("hello", "BOB greets you", () => {}, helloCommand)
    .version(false)
    .help().argv;
}
