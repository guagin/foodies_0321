import { MealViewRepository } from "order/query/domain/meal/meal-view-repository"
import { MealView } from "order/query/domain/meal/meal-view"
import { RepositoryEventPublisher } from "../repository-event-publisher"
import { Saved } from "./saved"

export class CQRSMealViewRepository implements MealViewRepository {
  constructor(private repository: MealViewRepository) {}

  listenTo(eventPublisher: RepositoryEventPublisher): void {
    eventPublisher.register<Saved>(Saved.name, async event => {
      const { meal } = event
      await this.save({
        id: meal.id.toValue(),
        name: meal.name,
        price: meal.price,
        description: meal.description,
        pictures: meal.pictures,
        status: meal.status,
        provider: meal.provider,
        createdBy: meal.createdBy
      })
    })
  }

  async ofId(id: string): Promise<MealView | undefined> {
    return this.repository.ofId(id)
  }

  async ofName(name: string): Promise<MealView[]> {
    return this.repository.ofName(name)
  }

  async ofProvider(provider: string): Promise<MealView[]> {
    return this.repository.ofProvider(provider)
  }

  async save(view: MealView): Promise<void> {
    return this.repository.save(view)
  }
}
