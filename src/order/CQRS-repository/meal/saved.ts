import { RepositoryEvent } from "./repository-event"
import { Meal } from "order/command/domain/meal/meal"

export class Saved extends RepositoryEvent {
  constructor(public meal: Meal) {
    super()
  }
}
