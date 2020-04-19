export class OrderNotPlaced extends Error {
  public alias = "ORDER_NOT_PLACED"
  constructor(message: string) {
    super(message)
  }
}
