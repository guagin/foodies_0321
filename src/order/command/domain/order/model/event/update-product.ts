import { OrderEvent } from "./order-event"

interface UpdateProductProps {
  index: number
  amount: number
  note: string
}

export class UpdateProduct extends OrderEvent {
  constructor(public payload: UpdateProductProps) {
    super(UpdateProduct.name)
  }
}
