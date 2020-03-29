export class AmountIsNegtaive extends Error {
  public alias = "AMOUNT_IS_NEGATIVE"
  constructor(message: string) {
    super(message)
  }
}
