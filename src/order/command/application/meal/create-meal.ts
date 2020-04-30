import { InMemoryMealRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-meal-repository"
import { MealId } from "order/command/domain/meal/meal"
import { CreateMealService } from "order/command/domain/meal/service/create-meal-service"
import { MealEventPublisher } from "order/command/domain/meal/meal-event-publisher"
import { DomainEventPublisher } from "domain-event-publisher"

export class CreateMeal {
  constructor(
    private mealRepository: InMemoryMealRepository,
    private eventPublisher: DomainEventPublisher
  ) {}

  async create(input: {
    name: string
    price: number
    description: string
    pictures: string[]
    provider: string
  }): Promise<MealId> {
    const createMealService = new CreateMealService({
      mealRepository: this.mealRepository,
      mealEventPublisher: new MealEventPublisher(this.eventPublisher)
    })

    const mealId = await createMealService.create({ ...input })
    return mealId
  }
}
