import { OrderRepository } from "order/domain/order/order-repository"
import { OrderId, Order, OrderStatus } from "order/domain/order/order"

export class CreateOrderUseCase {
  private orderRepository: OrderRepository
  constructor(depends: { orderRepository: OrderRepository }) {
    this.orderRepository = depends.orderRepository
  }

  async create(input: {
    userId: string
  }): Promise<{ success: boolean; errorMessage?: string; orderId?: OrderId }> {
    try {
      const orderId = await this.orderRepository.nextId()

      const order = new Order(orderId, {
        createdBy: input.userId,
        orderedProducts: [],
        status: OrderStatus.pended
      })
      await this.orderRepository.save(order)

      return {
        orderId,
        success: true
      }
    } catch (e) {
      return {
        success: false,
        errorMessage: `${e.alias}, ${e.message}`
      }
    }
  }
}
