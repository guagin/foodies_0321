import { MealViewRepository } from "../meal-view-repository"
import { MealView } from "../meal-view"

export class MealViewOfProviderService {
  constructor(private repository: MealViewRepository) {}

  async ofProvider(provider: string): Promise<MealView[]> {
    return this.repository.ofProvider(provider)
  }
}
