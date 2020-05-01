import { OrderViewRepository } from "order/query/domain/order/model/order-view-repository"
import { Saved } from "./saved"
import { OrderView } from "order/query/domain/order/model/order-view"
import { RepositoryEventPublisher } from "../repository-event-publisher"

export class CQRSOrderViewRepository implements OrderViewRepository {
  constructor(private repository: OrderViewRepository) {}

  listenTo(eventPublisher: RepositoryEventPublisher) {
    eventPublisher.register<Saved>(Saved.name, event => {
      const { order } = event

      this.save({
        id: order.id.toValue(),
        createdBy: order.createdBy,
        orderProducts: order.products,
        status: order.status,
        takeOutId: order.takeOutId
      })
    })
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
