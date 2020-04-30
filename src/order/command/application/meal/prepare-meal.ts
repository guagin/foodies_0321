import { DomainEventPublisher } from "domain-event-publisher"
import { MealRepository } from "order/command/domain/meal/meal-repository"
import { MealId } from "order/command/domain/meal/meal"
import { MealEventPublisher } from "order/command/domain/meal/meal-event-publisher"
import { PrepareMealService } from "order/command/domain/meal/service/prepare-meal-service"

export class PrepareMeal {
  constructor(
    private mealrepository: MealRepository,
    private eventPublisher: DomainEventPublisher
  ) {}

  async prepare(id: string): Promise<void> {
    const prepareMealService = new PrepareMealService(
      this.mealrepository,
      new MealEventPublisher(this.eventPublisher)
    )

    await prepareMealService.prepare(new MealId(id))
  }
}
