export class MealIsNotPreparing extends Error {
    public alias = "MEAL_IS_NOT_PREPARING"
    constructor(message?: string) {
      super(message)
    }
  }
  