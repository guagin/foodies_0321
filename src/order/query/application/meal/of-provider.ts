import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"
import { MealViewOfProviderService } from "order/query/domain/meal/service/meal-view-of-provider-service"

export class MealViewOfProvider {
  constructor(private repository: MealViewRepository) {}

  async ofProvider(provider: string): Promise<MealView[]> {
    const ofProviderService = new MealViewOfProviderService(this.repository)
    return ofProviderService.ofProvider(provider)
  }
}
