export class PasswordNotSetError extends Error {
  constructor() {
    super('Master password not configured for actions of type "secret"');
    this.name = "PasswordNotSetError";
  }
}
