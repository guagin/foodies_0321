import { MealEvent } from "./meal-event"

export class UpdateProperties extends MealEvent {
  constructor(
    public newProps: { name: string; price: number; description: string }
  ) {
    super(UpdateProperties.name)
  }
}
