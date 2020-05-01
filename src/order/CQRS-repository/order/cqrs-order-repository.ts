import { OrderRepository } from "order/command/domain/order/model/order-repository"

import { OrderId, Order } from "order/command/domain/order/model/order"
import { Saved } from "./saved"
import { RepositoryEventPublisher } from "../repository-event-publisher"

export class CQRSOrderRepository implements OrderRepository {
  constructor(
    private orderRepository: OrderRepository,
    private eventPublisher: RepositoryEventPublisher
  ) {}

  nextId(): Promise<OrderId> {
    return this.orderRepository.nextId()
  }

  ofId(id: OrderId): Promise<Order> {
    return this.orderRepository.ofId(id)
  }

  ofUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.ofUserId(userId)
  }

  async save(order: Order): Promise<void> {
    await this.orderRepository.save(order)
    this.eventPublisher.publish(new Saved(order))
  }
}
