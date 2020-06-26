import { OrderViewRepository } from "order/query/domain/order/model/order-view-repository"
import { OrderView } from "order/query/domain/order/model/order-view"

export const makeOrderOfPage: (
  orderViewRepository: OrderViewRepository
) => (input: {
  page: number
  count: number
}) => Promise<{
  orders: OrderView[]
  hasNext: boolean
  hasPrevious: boolean
  totalPages: number
  page: number
  totalCount: number
}> = orderViewRepository => {
  return async ({ page, count }) => {
    return orderViewRepository.ofPage({ page, count })
  }
}
