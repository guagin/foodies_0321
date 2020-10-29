import { MealView } from "./meal-view"

export interface MealViewRepository {
  ofId(id: string): Promise<MealView | undefined>
  ofIds(ids: string[]): Promise<MealView[]>
  ofProvider(input: {
    page: number
    count: number
    providerId?: string
  }): Promise<{
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }>
  save(view: MealView): Promise<void>
  ofName(name: string): Promise<MealView[]>
  ofPage({
    page,
    count
  }: {
    page: number
    count: number
  }): Promise<{
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }>
}
