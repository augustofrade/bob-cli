import { ArgumentsCamelCase } from "yargs";
import { PasswordStore } from "../core/Secrets/PasswordStore";

interface PasswdSetCommand {
  masterPassword: string;
}

export default async function passwdSetCommand(args: ArgumentsCamelCase<PasswdSetCommand>) {
  console.log("Setting new master password for my secret manager...");
  await PasswordStore.setMasterPassword(args.masterPassword);
  console.log(
    'Done! Try it with: "bob learn my-passwd \'super secret password\' --type secret" and then "bob do my-passwd"'
  );
}
