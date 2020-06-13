import { MealEvent } from "./meal-event"

export class Shelved extends MealEvent {
  constructor() {
    super(Shelved.name)
  }
}
