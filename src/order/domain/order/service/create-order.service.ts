import { OrderRepository } from "../order-repository"
import { Order, OrderId, OrderStatus } from "../order"

export class CreateOrderService {
  private orderRepository: OrderRepository
  constructor(input: { orderRepository: OrderRepository }) {
    this.orderRepository = input.orderRepository
  }

  async create(input: { userId: string }): Promise<OrderId> {
    const orderId = await this.orderRepository.nextId()

    const order = new Order(orderId, {
      createdBy: input.userId,
      orderedProducts: [],
      status: OrderStatus.pended
    })
    await this.orderRepository.save(order)

    return orderId
  }
}
