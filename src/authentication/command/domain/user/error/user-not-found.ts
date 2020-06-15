export class UserNotFound extends Error {
  public alias = "USER_NOT_FOUND"
  constructor(message?: string) {
    super(message || "user not found.")
  }
}
