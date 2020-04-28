import { MealEvent } from "./meal-event"

export class TurnedToPreparing extends MealEvent {
  constructor() {
    super(TurnedToPreparing.name)
  }
}
