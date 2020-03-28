export class OrderNotPended extends Error {
  public alias = "ORDER_NOT_PENDED"
  constructor(message: string) {
    super(message)
  }
}
