export class AmountIsFloat extends Error {
  public alias = "AMOUNT_IS_FLOAT"
  constructor(message: string) {
    super(message)
  }
}
