import { TakeOutViewOfUserIdService } from "order/query/domain/take-out/service/take-out-of-user-id-service"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"
import { TakeOutViewRepository } from "order/query/domain/take-out/take-out-view-repository"

export class TakeOutViewOfUserId {
  constructor(private repository: TakeOutViewRepository) {}

  async ofUserId(userId: string): Promise<TakeOutView[]> {
    const takeOutViewOfUserIdService = new TakeOutViewOfUserIdService(
      this.repository
    )
    return takeOutViewOfUserIdService.ofUserId(userId)
  }
}
