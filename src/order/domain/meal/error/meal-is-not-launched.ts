export class MealIsNotLaunched extends Error {
    public alias = "MEAL_IS_NOT_Launched"
    constructor(message?: string) {
      super(message)
    }
  }
  