import { Meal, MealId } from "order/command/domain/meal/meal"
import { MealRepository } from "order/command/domain/meal/meal-repository"

export class InMemoryMealRepository implements MealRepository {
  private data: Meal[]
  constructor() {
    this.data = []
  }

  async nextId(): Promise<MealId> {
    return new MealId(`m${this.data.length}`)
  }

  async ofId(id: MealId): Promise<Meal | undefined> {
    return this.data.find(d => d.id.equals(id))
  }

  save(meal: Meal): Promise<void> {
    const foundIndex = this.data.findIndex(elem => elem.id.equals(meal.id))
    if (foundIndex > -1) {
      this.data.splice(foundIndex, 1, meal)
      return
    }
    this.data.push(meal)
  }
}
