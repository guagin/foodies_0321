import { RepositoryEvent } from "../repository-event"
import { Meal } from "order/command/domain/meal/model/meal"

export class Saved extends RepositoryEvent {
  constructor(public meal: Meal) {
    super()
  }
}
