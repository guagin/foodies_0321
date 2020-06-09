import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"

import { MealView } from "order/query/domain/meal/meal-view"
import { MealsOfPageService } from "order/query/domain/meal/service/meals-of-page"

export class MealViewsOfPage {
  constructor(private mealRepository: MealViewRepository) {}

  async ofPage({
    page,
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
    const mealsOfPage = new MealsOfPageService(this.mealRepository)

    return mealsOfPage.ofPage({
      page,
      count
    })
  }
}
