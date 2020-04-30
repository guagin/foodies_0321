import { RepositoryEvent } from "./repository-event"
import { TakeOut } from "order/command/domain/take-out/model/take-out"

export class Saved extends RepositoryEvent {
  constructor(public takeOut: TakeOut) {
    super()
  }
}
