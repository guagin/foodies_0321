export class OrderNotFound extends Error {
  private alias = "ORDER_NOT_FOUND"
  constructor(message: string) {
    super(message)
  }
}
