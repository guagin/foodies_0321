import { TakeOutViewRepository } from "order/query/domain/take-out/take-out-view-repository"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"

export const makeTakeOutOfPartiaTitle: (depends: {
  takeOutViewRepository: TakeOutViewRepository
}) => (input: {
  title: string
  count: number
}) => Promise<{
  takeOuts: TakeOutView[]
}> = ({ takeOutViewRepository }) => {
  return async ({ title, count }) => {
    return {
      takeOuts: await takeOutViewRepository.ofPartialTitle({
        title,
        count
      })
    }
  }
}
