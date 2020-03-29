import { OrderRepository } from "../order-repository"
import { OrderId } from "../order"
import { Product } from "../product"
import { ProductNotFound } from "../error/product-not-found"

export class IncreaseProductAmountService {
  private orderRepository: OrderRepository

  constructor(depneds: { orderRepository: OrderRepository }) {
    this.orderRepository = depneds.orderRepository
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
