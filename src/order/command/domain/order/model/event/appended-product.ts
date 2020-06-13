import { OrderEvent } from "./order-event"

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
