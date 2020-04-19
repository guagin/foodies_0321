import { OrderRepository } from "order/command/domain/order/order-repository"
import { OrderEventPublisher } from "order/command/domain/order/event/order-event-publisher"
import { DomainEventPublisher } from "domain-event-publisher"
import { OrderId } from "order/command/domain/order/order"
import { OrderedProductEmpty } from "order/command/domain/order/error/ordered-product-empty"

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
    const order = await this.orderRepository.ofId(new OrderId(orderId))

    this.productsToRmeove.forEach(productToRemove => {
      if (order.isProductExists(productToRemove.id)) {
        const { id, amount } = productToRemove
        order.decreaseProductAmount(id, amount)
      }
    })

    await this.orderRepository.save(order)
    this.eventPublisher.productRemoved(order)
  }
}
