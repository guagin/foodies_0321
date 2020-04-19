export class AmountIsZero extends Error {
  public alias = "AMOUNT_IS_ZERO"
  constructor(message: string) {
    super(message)
  }
}
