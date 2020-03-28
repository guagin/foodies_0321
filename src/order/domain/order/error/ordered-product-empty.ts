export class OrderedProductEmpty extends Error {
  public alias = "ORDER_PRODUCT_EMPTY"
  constructor(message: string) {
    super(message)
  }
}
