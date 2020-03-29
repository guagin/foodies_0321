export class ProductNotFound extends Error {
  private alias = "PRODUCT_NOT_FOUND"
  constructor(message: string) {
    super(message)
  }
}
