import { DomainEventPublisher } from "event/domain-event-publisher"
import { MealRepository } from "order/command/domain/meal/meal-repository"
import { MealId } from "order/command/domain/meal/model/meal"
import { LaunchMealService } from "order/command/domain/meal/service/launch-meal-service"
import { MealEventPublisher } from "event/meal-event-publisher"

export class LaunchMeal {
  constructor(
    private mealrepository: MealRepository,
    private eventPublisher: DomainEventPublisher
  ) {}

  async launch(id: string): Promise<void> {
    const launchMealService = new LaunchMealService(
      this.mealrepository,
      new MealEventPublisher(this.eventPublisher)
    )

    await launchMealService.launch(new MealId(id))
  }
}
