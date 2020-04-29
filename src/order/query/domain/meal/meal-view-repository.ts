import { MealView } from "./meal-view"

export interface MealViewRepository {
  ofId(id: string): Promise<MealView | undefined>
  ofName(name: string): Promise<MealView[]>
  ofProvider(providerId: string): Promise<MealView[]>
  save(view: MealView): Promise<void>
}
