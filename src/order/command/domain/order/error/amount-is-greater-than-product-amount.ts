export class AmountIsGreaterThanProductAmount extends Error {
  public alias = "AMOUNT_IS_GREATER_THAN_PRODUCT_AMOUNT"
  constructor(message: string) {
    super(message)
  }
}
