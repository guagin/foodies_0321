export class ProductNotOrdered extends Error {
  public alias = "PRODUCT_NOT_ORDERED"
  constructor(message: string) {
    super(message)
  }
}
