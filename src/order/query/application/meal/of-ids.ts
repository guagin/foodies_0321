import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"
import { MealViewOfIdsService } from "order/query/domain/meal/service/meal-view-of-ids-service"

export class MealViewOfIdsUseCase {
  constructor(private repository: MealViewRepository) {}

  async ofIds(ids: string[]): Promise<MealView[]> {
    const ofIdService = new MealViewOfIdsService(this.repository)
    return ofIdService.ofIds(ids)
  }
}
