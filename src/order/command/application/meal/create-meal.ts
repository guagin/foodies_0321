import { MealId } from "order/command/domain/meal/model/meal"
import { CreateMealService } from "order/command/domain/meal/service/create-meal-service"
import { MealEventPublisher } from "event/meal-event-publisher"
import { DomainEventPublisher } from "event/domain-event-publisher"
import { MealRepository } from "order/command/domain/meal/meal-repository"

export class CreateMeal {
  constructor(
    private mealRepository: MealRepository,
    private eventPublisher: DomainEventPublisher
  ) {}

  async create(input: {
    name: string
    price: number
    description: string
    pictures: string[]
    provider: string
    createdBy: string
  }): Promise<MealId> {
    const createMealService = new CreateMealService({
      mealRepository: this.mealRepository,
      mealEventPublisher: new MealEventPublisher(this.eventPublisher)
    })

    const mealId = await createMealService.create({ ...input })
    return mealId
  }
}
