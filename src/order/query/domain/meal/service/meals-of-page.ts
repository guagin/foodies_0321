import { MealViewRepository } from "../meal-view-repository"
import { MealView } from "../meal-view"

export class MealsOfPageService {
  constructor(private mealRepository: MealViewRepository) {}

  async ofPage({
    page
  }: {
    page: number
  }): Promise<{
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
  }> {
    return this.mealRepository.ofPage({ page })
  }
}
