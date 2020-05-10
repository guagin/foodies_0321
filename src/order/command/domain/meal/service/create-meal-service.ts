import { MealRepository } from "../meal-repository"
import { MealEventPublisher } from "../meal-event-publisher"
import { Meal, MealStatus, MealId } from "../meal"

export class CreateMealService {
  private mealRepository: MealRepository
  private mealEventPublisher: MealEventPublisher
  constructor(depends: {
    mealRepository: MealRepository
    mealEventPublisher: MealEventPublisher
  }) {
    this.mealRepository = depends.mealRepository
    this.mealEventPublisher = depends.mealEventPublisher
  }

  async create(input: {
    name: string
    price: number
    description: string
    pictures: string[]
    provider: string
    createdBy: string
  }): Promise<MealId> {
    const mealId = await this.mealRepository.nextId()
    const meal = new Meal(mealId, {
      ...input,
      status: MealStatus.preparing
    })

    await this.mealRepository.save(meal)

    // TODO: fix the provider name.
    this.mealEventPublisher.mealPrepared(meal, "uber")
    return mealId
  }
}
