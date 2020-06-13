import { Meal, MealId } from "./model/meal"

export interface MealRepository {
  nextId(): Promise<MealId>
  ofId(id: MealId): Promise<Meal | undefined>
  save(meal: Meal): Promise<void>
}
