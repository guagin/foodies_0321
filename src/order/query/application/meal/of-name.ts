import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"

export class MealViewOfName {
  constructor(private repository: MealViewRepository) {}

  async ofName(name: string): Promise<MealView[]> {
    return this.repository.ofName(name)
  }
}
