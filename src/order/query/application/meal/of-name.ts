import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"
import { MealViewOfNameService } from "order/query/domain/meal/service/meal-view-of-name-service"

export class MealViewOfName {
  constructor(private repository: MealViewRepository) {}

  async ofName(name: string): Promise<MealView[]> {
    const ofNameService = new MealViewOfNameService(this.repository)
    return ofNameService.ofName(name)
  }
}
