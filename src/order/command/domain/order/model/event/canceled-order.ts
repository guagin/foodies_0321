import { OrderEvent } from "./order-event"

export class CanceledOrder extends OrderEvent {
  constructor() {
    super(CanceledOrder.name)
  }
}
