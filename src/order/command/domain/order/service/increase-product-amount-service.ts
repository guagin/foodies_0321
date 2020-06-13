import { OrderRepository } from "../model/order-repository"
import { OrderId } from "../model/order"
import { Product } from "../model/product"
import { ProductNotFound } from "../error/product-not-found"
import { OrderEventPublisher } from "../../../../../event/order-event-publisher"

export class IncreaseProductAmountService {
  private orderRepository: OrderRepository
  private orderEventPublisher: OrderEventPublisher

  constructor(depends: {
    orderRepository: OrderRepository
    eventPublisher: OrderEventPublisher
  }) {
    this.orderRepository = depends.orderRepository
    this.orderEventPublisher = depends.eventPublisher
  }

  // should make this to be idempotent
  async increase(
    orderId: OrderId,
    increase: { id: string; amount: number }
  ): Promise<void> {
    const order = await this.orderRepository.ofId(orderId)
    const product: Product | undefined = order.products.find(
      elem => elem.id === increase.id
    )

    if (!product) {
      throw new ProductNotFound("")
    }

    product.increase(increase.amount)
    await this.orderRepository.save(order)
  }
}
