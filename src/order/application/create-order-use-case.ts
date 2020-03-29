import { OrderRepository } from "order/domain/order/order-repository"
import { OrderId, Order, OrderStatus } from "order/domain/order/order"
import { CreateOrderService } from "order/domain/order/service/create-order.service"

export class CreateOrderUseCase {
  private orderRepository: OrderRepository
  constructor(depends: { orderRepository: OrderRepository }) {
    this.orderRepository = depends.orderRepository
  }

  async create(input: {
    userId: string
  }): Promise<{ success: boolean; errorMessage?: string; orderId?: OrderId }> {
    try {
      const createOrderService = new CreateOrderService({
        orderRepository: this.orderRepository
      })

      const orderId = await createOrderService.create({ userId: input.userId })

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
