import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"

export class MealViewOfIdUseCase {
  constructor(private repository: MealViewRepository) {}

  async ofId(id: string): Promise<MealView> {
    const result = await this.repository.ofId(id)

    if (!result) {
      throw Error(`meal view not found, id: ${id}`)
    }

    return result
  }
}
