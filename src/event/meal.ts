import { DomainEvent } from "event/domain-event"

interface Meal {
  id: string
  name: string
  price: number
  description: string
}

export class MealPrepared extends DomainEvent<{
  meal: Meal
  provider: {
    name: string
  }
}> {
  constructor(
    payload: {
      meal: Meal
      provider: {
        name: string
      }
    },
    applicationVersion: string
  ) {
    super(MealPrepared.name, applicationVersion, payload)
  }
}

export class MealLaunched extends DomainEvent<{
  meal: Meal
  provider: {
    name: string
  }
}> {
  constructor(
    payload: {
      meal: Meal
      provider: {
        name: string
      }
    },
    applicationVersion: string
  ) {
    super(MealLaunched.name, applicationVersion, payload)
  }
}

export class MealShelved extends DomainEvent<{
  meal: Meal
  provider: {
    name: string
  }
}> {
  constructor(
    payload: {
      meal: Meal
      provider: {
        name: string
      }
    },
    applicationVersion: string
  ) {
    super(MealShelved.name, applicationVersion, payload)
  }
}
