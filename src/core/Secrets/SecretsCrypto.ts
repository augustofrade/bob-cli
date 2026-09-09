import crypto from "crypto";

/**
 * Handles cryptography of user secrets
 */
export class SecretCrypto {
  private static readonly ALGORITHM = "aes-256-cbc";
  private static readonly SALT_LENGTH = 16;
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;

  public static encryptValue(value: string, password: string): string {
    const salt = crypto.randomBytes(this.SALT_LENGTH);
    const key = crypto.pbkdf2Sync(password, salt, 100000, this.KEY_LENGTH, "sha256");

    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

    let encrypted = cipher.update(value, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return salt.toString("hex") + ":" + iv.toString("hex") + ":" + encrypted;
  }

  public static decryptValue(encrypted: string, password: string): string {
    const parts = encrypted.split(":");
    const salt = Buffer.from(parts[0], "hex");
    const iv = Buffer.from(parts[1], "hex");
    const encryptedData = parts[2];

    const key = crypto.pbkdf2Sync(password, salt, 100000, this.KEY_LENGTH, "sha256");
    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);

    let decrypted = decipher.update(encryptedData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
  }
}
