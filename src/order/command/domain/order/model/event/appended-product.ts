import { OrderEvent } from "./order-event"
import { Product } from "../product"

export class AppendedProduct extends OrderEvent {
  constructor(public product: Product) {
    super(AppendedProduct.name)
  }
}
