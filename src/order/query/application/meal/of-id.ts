import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"
import { MealViewOfIdService } from "order/query/domain/meal/service/meal-view-of-id-service"

export class MealViewOfIdUseCase {
  constructor(private repository: MealViewRepository) {}

  async ofId(id: string): Promise<MealView> {
    const ofIdService = new MealViewOfIdService(this.repository)
    return ofIdService.ofId(id)
  }
}
