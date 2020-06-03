import { OrderRepository } from "../model/order-repository"
import { OrderId } from "../model/order"
import { OrderEventPublisher } from "../event/order-event-publisher"
import { OrderNotFound } from "../error/order-not-found"

export class RemoveProductService {
  private orderRepository: OrderRepository
  private eventPublisher: OrderEventPublisher

  constructor(dependes: {
    orderRepository: OrderRepository
    eventPublisher: OrderEventPublisher
  }) {
    this.orderRepository = dependes.orderRepository
    this.eventPublisher = dependes.eventPublisher
  }

  async remove(
    orderId: OrderId,
    products: {
      id: string
      amount: number
    }[]
  ): Promise<void> {
    const order = await this.orderRepository.ofId(orderId)

    if (!order) {
      throw new OrderNotFound(`order not found, id:${orderId.toValue()}`)
    }

    products.forEach(({ id, amount }) => {
      order.removeProduct({ id, amount })
    })

    await this.orderRepository.save(order)

    this.eventPublisher.productRemoved(order)
  }
}
