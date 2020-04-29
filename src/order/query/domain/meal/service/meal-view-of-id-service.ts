import { MongoMealViewRepository } from "order/query/infrastructure/mongo-meal-view-repository"
import { MealView } from "../meal-view"

export class MealViewOfIdService {
  constructor(private repository: MongoMealViewRepository) {}

  async ofId(id: string): Promise<MealView> {
    const found = await this.repository.ofId(id)

    if (!found) {
      throw new Error(`meal view not found : ${id}`)
    }

    return found
  }
}
