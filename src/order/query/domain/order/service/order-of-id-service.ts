import { OrderViewRepository } from "../model/order-view-repository"
import { OrderView } from "../model/order-view"

export class OrderOdIdService {
  constructor(private repository: OrderViewRepository) {}

  async ofId(id: string): Promise<OrderView> {
    const result = await this.repository.ofId(id)

    if (!result) {
      throw new Error(`order not found, id: ${id}`)
    }

    return result
  }
}
