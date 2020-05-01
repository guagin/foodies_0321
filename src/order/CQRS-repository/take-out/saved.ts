import { TakeOut } from "order/command/domain/take-out/model/take-out"
import { RepositoryEvent } from "../repository-event"

export class Saved extends RepositoryEvent {
  constructor(public takeOut: TakeOut) {
    super()
  }
}
