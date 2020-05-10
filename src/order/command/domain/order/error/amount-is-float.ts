export class AmountIsFloat extends Error {
  public alias = "AMOUNT_IS_NOT_INTEGER"
  constructor(message: string) {
    super(message)
  }
}
