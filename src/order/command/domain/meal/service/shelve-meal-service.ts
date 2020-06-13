import { MealRepository } from "../meal-repository"
import { MealEventPublisher } from "../../../../../event/meal-event-publisher"
import { MealId } from "../model/meal"

export class ShelveMealService {
  constructor(
    private mealRepository: MealRepository,
    private eventPublisher: MealEventPublisher
  ) {}

  async shelve(id: MealId): Promise<void> {
    const meal = await this.mealRepository.ofId(id)

    meal.shelve()

    await this.mealRepository.save(meal)

    this.eventPublisher.mealShelved(meal, "uber")
  }
}
