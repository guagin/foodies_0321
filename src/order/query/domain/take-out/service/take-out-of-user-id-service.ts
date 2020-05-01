import { TakeOutViewRepository } from "../model/take-out-view-repository"
import { TakeOutView } from "../model/take-out-view"

export class TakeOutOfUserIdService {
  constructor(private repository: TakeOutViewRepository) {}

  async ofUserId(userId: string): Promise<TakeOutView[]> {
    return this.repository.ofUserId(userId)
  }
}