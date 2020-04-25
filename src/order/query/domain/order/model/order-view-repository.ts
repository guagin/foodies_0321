import { OrderView } from "./order-view"

export interface OrderViewRepository {
  ofId(id: string): Promise<OrderView | undefined>
  ofUserId(userId: string): Promise<OrderView[]>
  save(orderView: OrderView): Promise<void>
}
