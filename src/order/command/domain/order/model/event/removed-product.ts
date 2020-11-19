import { OrderEvent } from "./order-event"

export class RemovedProduct extends OrderEvent {
  constructor(public payload: { index: number }) {
    super(RemovedProduct.name)
  }
}
