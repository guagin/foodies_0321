import { RepositoryEvent } from "./repository-event"
import { Order } from "order/command/domain/order/model/order"

export class Saved extends RepositoryEvent {
  constructor(public order: Order) {
    super()
  }
}
