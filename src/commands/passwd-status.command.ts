import { PasswordStore } from "../core/Secrets/PasswordStore";

export default async function passwdStatusCommand() {
  const hasPassword = await PasswordStore.hasMasterPasswordSetUp();

  if (hasPassword) {
    console.log("Secret manager master password is already set up");
    return;
  }

  console.log("Master password for the secret manager isn't status");
}
