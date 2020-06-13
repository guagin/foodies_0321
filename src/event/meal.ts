import { DomainEvent } from "domain-event"

interface Meal {
  id: string
  name: string
  price: number
  description: string
}

export class MealPrepared extends DomainEvent {
  constructor(
    public payload: {
      meal: Meal
      provider: {
        name: string
      }
    },
    applicationVersion: string
  ) {
    super(MealPrepared.name, applicationVersion)
  }
}

export class MealLaunched extends DomainEvent {
  constructor(
    public payload: {
      meal: Meal
      provider: {
        name: string
      }
    },
    applicationVersion: string
  ) {
    super(MealLaunched.name, applicationVersion)
  }
}

export class MealShelved extends DomainEvent {
  constructor(
    public payload: {
      meal: Meal
      provider: {
        name: string
      }
    },
    applicationVersion: string
  ) {
    super(MealShelved.name, applicationVersion)
  }
}
