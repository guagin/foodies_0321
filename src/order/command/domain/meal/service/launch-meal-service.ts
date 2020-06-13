import { MealRepository } from "../meal-repository"
import { MealEventPublisher } from "../../../../../event/meal-event-publisher"
import { MealId } from "../model/meal"

export class LaunchMealService {
  constructor(
    private mealRepository: MealRepository,
    private mealEventPublisher: MealEventPublisher
  ) {}

  async launch(id: MealId): Promise<void> {
    const meal = await this.mealRepository.ofId(id)

    meal.launch()

    await this.mealRepository.save(meal)

    this.mealEventPublisher.mealLaunched(meal, "uber")
  }
}
