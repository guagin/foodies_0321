import { OrderViewRepository } from "order/query/domain/order/model/order-view-repository"
import { RepositoryEventPublisher } from "./repository-event-publisher"
import { Saved } from "./saved"
import { OrderView } from "order/query/domain/order/model/order-view"

export class CQRSOrderViewRepository implements OrderViewRepository {
  constructor(private repository: OrderViewRepository) {}

  listenTo(eventPublisher: RepositoryEventPublisher) {
    eventPublisher.register<Saved>(Saved.name, () => {})
  }

  ofId(id: string): Promise<OrderView> {
    return this.repository.ofId(id)
  }

  ofUserId(userId: string): Promise<OrderView[]> {
    return this.repository.ofUserId(userId)
  }

  async save(orderView: OrderView): Promise<void> {
    this.repository.save(orderView)
  }
}
