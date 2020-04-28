import { MealEvent } from "./meal-event"

export class Launched extends MealEvent {
  constructor() {
    super(Launched.name)
  }
}
