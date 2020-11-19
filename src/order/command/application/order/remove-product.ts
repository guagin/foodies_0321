import { OrderRepository } from "order/command/domain/order/model/order-repository"
import { OrderEventPublisher } from "event/order-event-publisher"
import { DomainEventPublisher } from "event/domain-event-publisher"
import { OrderId } from "order/command/domain/order/model/order"
import { RemoveProductService } from "order/command/domain/order/service/remove-product-service"

export class RemoveProduct {
  private orderRepository: OrderRepository
  private eventPublisher: OrderEventPublisher
  private index: number

  constructor(depends: {
    orderRepository: OrderRepository
    eventPublisher: DomainEventPublisher
  }) {
    this.orderRepository = depends.orderRepository
    this.eventPublisher = new OrderEventPublisher(depends.eventPublisher)
  }

  remove(index: number): RemoveProduct {
    this.index = index
    return this
  }

  async from(orderId: string): Promise<void> {
    const removeProduct = new RemoveProductService({
      orderRepository: this.orderRepository,
      eventPublisher: this.eventPublisher
    })

    removeProduct.remove(new OrderId(orderId), this.index)
  }
}
