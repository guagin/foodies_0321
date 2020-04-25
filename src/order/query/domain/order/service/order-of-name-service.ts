import { OrderViewRepository } from "../model/order-view-repository"
import { OrderView } from "../model/order-view"

export class OrderOfNameService {
  constructor(private repository: OrderViewRepository) {}

  async ofUserId(userId: string): Promise<OrderView> {
    const result = await this.repository.ofUserId(userId)

    if (!result) {
      throw new Error(`order not found, userId: ${userId}`)
    }

    return result
  }
}
