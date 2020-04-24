import { OrderRepository } from "order/command/domain/order/model/order-repository"
import { OrderId, Order } from "order/command/domain/order/model/order"

export class InMemoryOrderRepository implements OrderRepository {
  private data: Order[] = []
  constructor() {
    this.data = []
  }

  async nextId(): Promise<OrderId> {
    return new OrderId(`p${this.data.length}`)
  }

  async ofId(orderId: OrderId): Promise<Order | undefined> {
    return this.data.find(elem => elem.id.equals(orderId))
  }

  async ofUserId(userId: string): Promise<Order[]> {
    const ordersOfUserId: Order[] = []
    this.data.forEach(elem => {
      if (elem.isOwnedBy(userId)) {
        ordersOfUserId.push(elem)
      }
    })
    return ordersOfUserId
  }

  async save(order: Order): Promise<void> {
    const foundIndex = this.data.findIndex(elem => elem.id.equals(order.id))
    if (foundIndex > -1) {
      this.data.splice(foundIndex, 1, order)
      return
    }
    this.data.push(order)
  }
}
