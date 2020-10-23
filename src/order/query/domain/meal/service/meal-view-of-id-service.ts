import { MealView } from "../meal-view"
import { MealViewRepository } from "../meal-view-repository"

export class MealViewOfIdsService {
  constructor(private repository: MealViewRepository) {}

  async ofIds(ids: string[]): Promise<MealView[]> {
    return this.repository.ofIds(ids)
  }
}
