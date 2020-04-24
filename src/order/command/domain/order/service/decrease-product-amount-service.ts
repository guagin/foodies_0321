import { OrderRepository } from "../model/order-repository"
import { OrderId } from "../model/order"
import { ProductNotFound } from "../error/product-not-found"

export class DecreaseProductAmountService {
  private orderRepository: OrderRepository
  constructor(depends: { orderRepository: OrderRepository }) {
    this.orderRepository = depends.orderRepository
  }

  async decrease(
    orderId: OrderId,
    decrease: { id: string; amount: number }
  ): Promise<void> {
    const order = await this.orderRepository.ofId(orderId)
    const product = order.products.find(elem => elem.id === decrease.id)
    if (!product) {
      throw new ProductNotFound("")
    }

    product.decrease(decrease.amount)
    await this.orderRepository.save(order)
  }
}
