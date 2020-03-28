export class CreatedByNotValid extends Error {
  public alias = "CREATE_BY_NOT_VALID"
  constructor(message: string) {
    super(message)
  }
}
