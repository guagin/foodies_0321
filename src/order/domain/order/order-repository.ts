import { OrderId, Order } from "./order"

export interface OrderRepository {
  nextId(): Promise<OrderId>
  ofId(id: OrderId): Promise<Order | undefined>
  ofUserId(id: string): Promise<Order[]>
  save(order: Order): Promise<void>
}
