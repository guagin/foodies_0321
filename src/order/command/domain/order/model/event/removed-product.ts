import { OrderEvent } from "./order-event"

export class RemovedProduct extends OrderEvent {
  constructor(payload: { productId: string }) {
    super(RemovedProduct.name)
  }
}
