import chalk from "chalk";
import { ArgumentsCamelCase } from "yargs";
import { PasswordStore } from "../core/Secrets/PasswordStore";

interface PasswdForgetCommand {
  confirm?: boolean;
}

export default async function passwdForgetCommand(args: ArgumentsCamelCase<PasswdForgetCommand>) {
  const hasPassword = await PasswordStore.hasMasterPasswordSetUp();
  if (!hasPassword) {
    console.log("You haven't set up a master password for the secret manager yet.");
    return;
  }

  if (args.confirm !== true) {
    console.log(
      "Remember: actions of type 'secret' that I've learnt won't work anymore with a different master password or without one."
    );
    console.log(
      `If you are sure about it, use '${chalk.red("bob passwd forget --confirm")}' to clear it.`
    );
    return;
  }

  await PasswordStore.clearMasterPassword();
  console.log("Master password cleared.");
}
