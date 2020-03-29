import { OrderRepository } from "../order-repository"
import { Product } from "../product"
import { OrderId } from "../order"
import { OrderNotFound } from "../error/order-not-found"

export class AppendProductService {
  private orderRepository: OrderRepository
  constructor(input: { orderRepository: OrderRepository }) {
    this.orderRepository = input.orderRepository
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
