import { OrderViewRepository } from "order/query/domain/order/model/order-view-repository"
import { OrderView } from "order/query/domain/order/model/order-view"
import { OrderViewOfIdService } from "order/query/domain/order/service/order-of-id-service"

export class OrderViewOfId {
  constructor(private repository: OrderViewRepository) {}

  async ofId(id: string): Promise<OrderView> {
    const ofIdService = new OrderViewOfIdService(this.repository)
    return ofIdService.ofId(id)
  }
}
