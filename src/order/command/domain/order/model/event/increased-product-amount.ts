import { OrderEvent } from "./order-event"

export class IncreasedProductAmount extends OrderEvent {
  constructor(public payload: { productId: string; amount: number }) {
    super(IncreasedProductAmount.name)
  }
}
