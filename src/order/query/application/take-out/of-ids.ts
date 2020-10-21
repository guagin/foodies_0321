import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"
import { TakeOutViewRepository } from "order/query/domain/take-out/take-out-view-repository"

export const makeTakeOutOfIds: (depends: {
  takeOutViewRepository: TakeOutViewRepository
}) => (input: {
  ids: string[]
}) => Promise<{
  takeOuts: TakeOutView[]
}> = ({ takeOutViewRepository }) => {
  return async ({ ids }) => {
    return {
      takeOuts: await takeOutViewRepository.ofIds(ids)
    }
  }
}
