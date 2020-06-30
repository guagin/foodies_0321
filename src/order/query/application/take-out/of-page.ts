import { TakeOutViewRepository } from "order/query/domain/take-out/model/take-out-view-repository"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"

export const makeTakeOutOfPage: (depends: {
  takeOutViewRepository: TakeOutViewRepository
}) => (input: {
  toPage: number
  count: number
}) => Promise<{
  takeOuts: TakeOutView[]
  hasNext: boolean
  hasPrevious: boolean
  totalPages: number
  page: number
  totalCount: number
}> = ({ takeOutViewRepository }) => {
  return async ({ toPage, count }) => {
    return takeOutViewRepository.ofPage({ toPage, count })
  }
}
