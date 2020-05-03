import { OrderRepository } from "../model/order-repository"
import { Order, OrderId, OrderStatus } from "../model/order"
import { OrderEventPublisher } from "../event/order-event-publisher"

export class CreateOrderService {
  private orderRepository: OrderRepository
  private eventPublisher: OrderEventPublisher

  constructor(input: {
    orderRepository: OrderRepository
    eventPublisher: OrderEventPublisher
  }) {
    this.orderRepository = input.orderRepository
    this.eventPublisher = input.eventPublisher
  }

  async create(input: { userId: string; takeOutId: string }): Promise<OrderId> {
    const { userId, takeOutId } = input
    const orderId = await this.orderRepository.nextId()

    const order = new Order(orderId, {
      createdBy: userId,
      products: [],
      status: OrderStatus.pended,
      takeOutId
    })
    await this.orderRepository.save(order)

    this.eventPublisher.orderCreated(order)

    return orderId
  }
}
