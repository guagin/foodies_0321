import { DomainEventPublisher } from "event/domain-event-publisher"
import { MealRepository } from "order/command/domain/meal/meal-repository"
import { MealId } from "order/command/domain/meal/model/meal"
import { MealEventPublisher } from "event/meal-event-publisher"
import { PrepareMealService } from "order/command/domain/meal/service/prepare-meal-service"

export class PrepareMeal {
  constructor(
    private mealRepository: MealRepository,
    private eventPublisher: DomainEventPublisher
  ) {}

  async prepare(id: string): Promise<void> {
    const prepareMealService = new PrepareMealService(
      this.mealRepository,
      new MealEventPublisher(this.eventPublisher)
    )

    await prepareMealService.prepare(new MealId(id))
  }
}
