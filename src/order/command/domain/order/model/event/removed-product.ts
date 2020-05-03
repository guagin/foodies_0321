import { OrderEvent } from "./order-event"

export class RemovedProduct extends OrderEvent {
  constructor(public payload: { productId: string }) {
    super(RemovedProduct.name)
  }
}
