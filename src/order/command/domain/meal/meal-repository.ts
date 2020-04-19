import { Meal, MealId } from "./meal";

export interface MealRepository{
    nextId(): Promise<MealId>
    ofId(id: MealId): Promise<Meal | undefined>
    save(meal: Meal):Promise<void>
}