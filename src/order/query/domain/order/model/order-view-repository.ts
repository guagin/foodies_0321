import { OrderView } from "./order-view"

export interface OrderViewRepository {
  ofId(id: string): Promise<OrderView | undefined>
  ofUserId(userId: string): Promise<OrderView[]>
  ofTakeoutId(takeoutId: string): Promise<OrderView[]>
  save(orderView: OrderView): Promise<void>
  ofPage({
    page: pageInput,
    count
  }: {
    page: number
    count: number
  }): Promise<{
    orders: OrderView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }>
}
