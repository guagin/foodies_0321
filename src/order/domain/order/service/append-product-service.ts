import { OrderRepository } from "../order-repository"
import { Product } from "../product"
import { OrderId } from "../order"
import { OrderNotFound } from "../error/order-not-found"
import { OrderEventPublisher } from "../event/order-event-publisher"

export class AppendProductService {
  private orderRepository: OrderRepository
  private orderEventPublisher: OrderEventPublisher

constructor(input: { orderRepository: OrderRepository, eventPublisher: OrderEventPublisher }) {
    this.orderRepository = input.orderRepository
    this.orderEventPublisher = input.eventPublisher
  }

  async append(orderId: OrderId, product: Product): Promise<void> {
    const order = await this.orderRepository.ofId(orderId)
    if (!order) {
      throw new OrderNotFound("")
    }
    order.appendProduct(product)
    this.orderRepository.save(order)
  }
}
