import { MealViewRepository } from "../meal-view-repository"
import { MealView } from "../meal-view"

export class MealViewOfNameService {
  constructor(private repository: MealViewRepository) {}

  async ofName(name: string): Promise<MealView[]> {
    return this.repository.ofName(name)
  }
}
