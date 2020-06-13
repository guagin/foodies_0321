import { MealEventPublisher } from "../../../../../event/meal-event-publisher"
import { MealRepository } from "../meal-repository"
import { MealId } from "../model/meal"

export class PrepareMealService {
  constructor(
    private mealRepository: MealRepository,
    private mealEventPublisher: MealEventPublisher
  ) {}

  async prepare(id: MealId): Promise<void> {
    const meal = await this.mealRepository.ofId(id)

    meal.prepare()

    await this.mealRepository.save(meal)

    this.mealEventPublisher.mealPrepared(meal, "uber")
  }
}
