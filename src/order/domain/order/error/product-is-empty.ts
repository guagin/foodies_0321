export class ProductIsEmpty extends Error {
    public alias = "PRODUCT_IS_EMPTY"
    constructor(message: string) {
      super(message)
    }
  }
  