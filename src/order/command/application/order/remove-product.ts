import { OrderRepository } from "order/command/domain/order/model/order-repository"
import { OrderEventPublisher } from "order/command/domain/order/event/order-event-publisher"
import { DomainEventPublisher } from "domain-event-publisher"
import { OrderId } from "order/command/domain/order/model/order"
import { RemoveProductService } from "order/command/domain/order/service/remove-product-service"

export class RemoveProduct {
  private orderRepository: OrderRepository
  private eventPublisher: OrderEventPublisher
  private productsToRmeove: { id: string; amount: number }[]

  constructor(depends: {
    orderRepository: OrderRepository
    eventPublisher: DomainEventPublisher
  }) {
    this.orderRepository = depends.orderRepository
    this.eventPublisher = new OrderEventPublisher(depends.eventPublisher)
  }

  remove(productsToRemove: { id: string; amount: number }[]): RemoveProduct {
    this.productsToRmeove = productsToRemove
    return this
  }

  async from(orderId: string): Promise<void> {
    const removeProduct = new RemoveProductService({
      orderRepository: this.orderRepository,
      eventPublisher: this.eventPublisher
    })

    removeProduct.remove(new OrderId(orderId), this.productsToRmeove)
  }
}
