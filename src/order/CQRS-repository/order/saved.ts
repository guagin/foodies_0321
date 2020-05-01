import { Order } from "order/command/domain/order/model/order"
import { RepositoryEvent } from "../repository-event"

export class Saved extends RepositoryEvent {
  constructor(public order: Order) {
    super()
  }
}
