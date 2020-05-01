import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"

export class MealViewOfProvider {
  constructor(private repository: MealViewRepository) {}

  async ofProvider(provider: string): Promise<MealView[]> {
    return this.repository.ofProvider(provider)
  }
}
