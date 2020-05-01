import { MongoTakeOutViewRepository } from "order/query/infrastructure/mongo-take-out-view-repository"
import { TakeOutViewOfUserIdService } from "order/query/domain/take-out/service/take-out-of-user-id-service"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"

export class TakeOutViewOfUserId {
  constructor(private repository: MongoTakeOutViewRepository) {}

  async ofUserId(userId: string): Promise<TakeOutView[]> {
    const takeOutViewOfUserIdService = new TakeOutViewOfUserIdService(
      this.repository
    )
    return takeOutViewOfUserIdService.ofUserId(userId)
  }
}
