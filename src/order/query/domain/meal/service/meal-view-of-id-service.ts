import { MealView } from "../meal-view"
import { MealViewRepository } from "../meal-view-repository"

export class MealViewOfIdService {
  constructor(private repository: MealViewRepository) {}

  async ofId(id: string): Promise<MealView> {
    return this.repository.ofId(id)
  }
}
