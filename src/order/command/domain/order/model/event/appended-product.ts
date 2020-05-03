import { OrderEvent } from "./order-event"
import { Product } from "../product"

interface ProductProps {
  id: string
  amount: number
  note: string
}

export class AppendedProduct extends OrderEvent {
  constructor(public product: ProductProps) {
    super(AppendedProduct.name)
  }
}
