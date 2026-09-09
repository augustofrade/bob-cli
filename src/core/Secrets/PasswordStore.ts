import keytar from "keytar";

export class PasswordStore {
  private static readonly SERVICE = "bob-cli";
  private static readonly ACCOUNT = "master-password";

  public static setMasterPassword(masterPwd: string): Promise<void> {
    return keytar.setPassword(this.SERVICE, this.ACCOUNT, masterPwd);
  }

  public static async hasMasterPasswordSetUp(): Promise<boolean> {
    const pwd = await keytar.getPassword(this.SERVICE, this.ACCOUNT);
    return pwd !== null;
  }

  public static clearMasterPassword() {
    return keytar.deletePassword(this.SERVICE, this.ACCOUNT);
  }
}
