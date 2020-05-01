import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"

export class MealOfIdUseCase {
  constructor(private repository: MealViewRepository) {}

  async ofId(id: string): Promise<MealView> {
    return this.repository.ofId(id)
  }
}
