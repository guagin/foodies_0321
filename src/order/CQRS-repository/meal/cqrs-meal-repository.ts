import { MealRepository } from "order/command/domain/meal/meal-repository"
import { MealId, Meal } from "order/command/domain/meal/meal"
import { RepositoryEventPublisher } from "./repository-event-publisher"
import { Saved } from "./saved"

export class CQRSMealRepository implements MealRepository {
  constructor(
    private repository: MealRepository,
    private eventPublisher: RepositoryEventPublisher
  ) {}

  async nextId(): Promise<MealId> {
    return this.repository.nextId()
  }

  async ofId(id: MealId): Promise<Meal | undefined> {
    return this.repository.ofId(id)
  }

  async save(meal: Meal): Promise<void> {
    await this.repository.save(meal)

    this.eventPublisher.publish(new Saved(meal))
  }
}
