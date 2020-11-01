import { OrderViewRepository } from "../model/order-view-repository"
import { OrderView } from "../model/order-view"

export const makeOrderOfTakeoutId: (
  orderViewRepository: OrderViewRepository
) => (input: {
  takeoutId: string
}) => Promise<OrderView[]> = orderViewRepository => {
  return async ({ takeoutId }) => {
    const result = await orderViewRepository.ofTakeoutId(takeoutId)

    return result
  }
}
