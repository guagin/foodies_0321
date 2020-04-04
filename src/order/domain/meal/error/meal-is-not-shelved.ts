export class MealIsNotShelved extends Error {
    public alias = "MEAL_IS_NOT_SHELVED"
    constructor(message?: string) {
      super(message)
    }
  }
  