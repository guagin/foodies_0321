import { DomainEventPublisher } from "domain-event-publisher"
import { Meal } from "./meal"
import { MealPrepared, MealLaunched, MealShelved } from "event/meal"

export class MealEventPublisher {
  private applicationVeriosn = process.env.applicationVeriosn || "0.0.0.0"
  constructor(private eventPublisher: DomainEventPublisher) {}

  mealPrepared(meal: Meal, providerName: string): void {
    const event = new MealPrepared(
      {
        meal: {
          id: meal.id.toValue(),
          name: meal.name,
          price: meal.price,
          description: meal.description
        },
        provider: {
          name: providerName
        }
      },
      this.applicationVeriosn
    )
    this.eventPublisher.publish(event)
  }

  mealLaunched(meal: Meal, providerName: string): void {
    const event = new MealLaunched(
      {
        meal: {
          id: meal.id.toValue(),
          name: meal.name,
          price: meal.price,
          description: meal.description
        },
        provider: {
          name: providerName
        }
      },
      this.applicationVeriosn
    )
    this.eventPublisher.publish(event)
  }

  mealShelved(meal: Meal, providerName: string): void {
    const event = new MealShelved(
      {
        meal: {
          id: meal.id.toValue(),
          name: meal.name,
          price: meal.price,
          description: meal.description
        },
        provider: {
          name: providerName
        }
      },
      this.applicationVeriosn
    )
    this.eventPublisher.publish(event)
  }
}
