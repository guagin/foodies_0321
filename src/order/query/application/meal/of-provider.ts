import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"
import { MealViewOfProviderService } from "order/query/domain/meal/service/meal-view-of-provider-service"

export class MealViewOfProvider {
  constructor(private repository: MealViewRepository) {}

  async ofProvider({
    page,
    count,
    providerId
  }: {
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
    const ofProviderService = new MealViewOfProviderService(this.repository)
    return ofProviderService.ofProvider({ page, count, providerId })
  }
}
