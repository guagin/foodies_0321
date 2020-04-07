import { OrderId, Order } from "./order"

export interface OrderRepository {
  // TODO: we should consider the compose compose uuid and takeOut activity id to avoid duplicated order.
  nextId(): Promise<OrderId>
  ofId(id: OrderId): Promise<Order | undefined>
  ofUserId(id: string): Promise<Order[]>
  save(order: Order): Promise<void>
}
