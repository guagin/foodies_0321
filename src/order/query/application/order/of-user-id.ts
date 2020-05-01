import { OrderViewRepository } from "order/query/domain/order/model/order-view-repository"
import { OrderViewOfUserIdService } from "order/query/domain/order/service/order-of-user-id-service"
import { OrderView } from "order/query/domain/order/model/order-view"

export class OrderViewOfUserId {
  constructor(private repository: OrderViewRepository) {}

  async ofUserId(userId: string): Promise<OrderView[]> {
    const orderViewOfUserIdService = new OrderViewOfUserIdService(
      this.repository
    )

    return orderViewOfUserIdService.ofUserId(userId)
  }
}
