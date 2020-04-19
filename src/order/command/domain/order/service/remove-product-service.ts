import { OrderRepository } from "../order-repository"
import { OrderId } from "../order"

export class RemoveProductService {
  private orderRepository: OrderRepository
  constructor(dependes: { orderRepository: OrderRepository }) {
    this.orderRepository = dependes.orderRepository
  }

  async remove(orderId: OrderId, productId: string): Promise<void> {
    const order = await this.orderRepository.ofId(orderId)
    order.removeProduct(productId)
    await this.orderRepository.save(order)
  }
}
