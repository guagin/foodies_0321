import { OrderRepository } from "../order-repository"
import { Order, OrderId, OrderStatus } from "../order"
import { OrderEventPublisher } from "../event/order-event-publisher"


export class CreateOrderService {
  private orderRepository: OrderRepository
  private eventPublisher: OrderEventPublisher

  constructor(input: { orderRepository: OrderRepository, eventPublisher: OrderEventPublisher }) {
    this.orderRepository = input.orderRepository
    this.eventPublisher = input.eventPublisher
  }

  async create(input: { userId: string }): Promise<OrderId> {
    const orderId = await this.orderRepository.nextId()

    const order = new Order(orderId, {
      createdBy: input.userId,
      orderedProducts: [],
      status: OrderStatus.pended
    })
    await this.orderRepository.save(order)

    this.eventPublisher.orderCreated(order)

    return orderId
  }
}
