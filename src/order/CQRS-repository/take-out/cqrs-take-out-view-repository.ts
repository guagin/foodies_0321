import { TakeOutViewRepository } from "order/query/domain/take-out/model/take-out-view-repository"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"
import { RepositoryEventPublisher } from "./repository-event-publisher"
import { Saved } from "./saved"

export class CQRSTakeOutViewRepository implements TakeOutViewRepository {
  constructor(private repository: TakeOutViewRepository) {}

  listenTo(eventPublisher: RepositoryEventPublisher) {
    eventPublisher.register<Saved>(Saved.name, async event => {
      const { takeOut } = event

      await this.save({
        id: takeOut.id.toValue(),
        title: takeOut.title,
        createdBy: takeOut.title,
        description: takeOut.description,
        startedAt: takeOut.startedAt,
        endAt: takeOut.endAt,
        enabled: takeOut.enabled
      })
    })
  }

  async ofId(id: string): Promise<TakeOutView | undefined> {
    return this.repository.ofId(id)
  }

  async ofUserId(userId: string): Promise<TakeOutView[]> {
    return this.repository.ofUserId(userId)
  }

  async save(view: TakeOutView): Promise<void> {
    return this.repository.save(view)
  }
}
