import { MealViewRepository } from "../meal-view-repository"
import { MealView } from "../meal-view"

export class MealViewOfProviderService {
  constructor(private repository: MealViewRepository) {}

  async ofProvider(input: {
    page: number
    count: number
    providerId: string
  }): Promise<{
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }> {
    return this.repository.ofProvider(input)
  }
}
