import { OrderEvent } from "./order-event"

export class RemovedProduct extends OrderEvent {
  constructor(public payload: { id: string; amount: number }) {
    super(RemovedProduct.name)
  }
}
