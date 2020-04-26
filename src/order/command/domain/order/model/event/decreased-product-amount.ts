import { OrderEvent } from "./order-event"

export class DecreasedProductAmount extends OrderEvent {
  constructor(public payload: { productId: string; amount: number }) {
    super(DecreasedProductAmount.name)
  }
}
