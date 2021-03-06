import { DomainEventPublisher } from "event/domain-event-publisher"
import { MealRepository } from "order/command/domain/meal/meal-repository"
import { MealId } from "order/command/domain/meal/model/meal"
import { MealEventPublisher } from "event/meal-event-publisher"
import { ShelveMealService } from "order/command/domain/meal/service/shelve-meal-service"

export class ShelveMeal {
  constructor(
    private mealrepository: MealRepository,
    private eventPublisher: DomainEventPublisher
  ) {}

  async shelve(id: string): Promise<void> {
    const shelveMealService = new ShelveMealService(
      this.mealrepository,
      new MealEventPublisher(this.eventPublisher)
    )

    await shelveMealService.shelve(new MealId(id))
  }
}
