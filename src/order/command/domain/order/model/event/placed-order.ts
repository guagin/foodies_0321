import { OrderEvent } from "./order-event"

export class PlacedOrder extends OrderEvent {
  constructor() {
    super(PlacedOrder.name)
  }
}
