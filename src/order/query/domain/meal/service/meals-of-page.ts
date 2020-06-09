import { MealViewRepository } from "../meal-view-repository"
import { MealView } from "../meal-view"

export class MealsOfPageService {
  constructor(private mealRepository: MealViewRepository) {}

  async ofPage({
    page: pageInput,
    count
  }: {
    page: number
    count: number
  }): Promise<{
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }> {
    const {
      meals,
      hasNext,
      hasPrevious,
      totalPages,
      page,
      totalCount
    } = await this.mealRepository.ofPage({ page: pageInput, count })

    return {
      meals,
      hasNext,
      hasPrevious,
      totalPages,
      page,
      totalCount
    }
  }
}
