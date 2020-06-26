import { OrderViewRepository } from "order/query/domain/order/model/order-view-repository"
import { Saved } from "./saved"
import { OrderView } from "order/query/domain/order/model/order-view"
import { RepositoryEventPublisher } from "../repository-event-publisher"

import debug from "debug"
import { Product } from "order/command/domain/order/model/product"
import { ProductView } from "order/query/domain/order/model/product"

const logger = debug("debug: CQRSOrderViewRepository")

const convertToProductView: (product: Product) => ProductView = product => {
  logger(`${JSON.stringify(product)}`)
  return {
    id: product.id,
    amount: product.amount,
    note: product.note
  }
}

export class CQRSOrderViewRepository implements OrderViewRepository {
  constructor(private repository: OrderViewRepository) {}

  listenTo(eventPublisher: RepositoryEventPublisher): void {
    eventPublisher.register<Saved>(Saved.name, async event => {
      const { order } = event
      logger(`recevied event: ${JSON.stringify(order)}`)
      const products = order.products.map(p => convertToProductView(p))
      logger(`products: ${JSON.stringify(products)}`)
      await this.save({
        id: order.id.toValue(),
        createdBy: order.createdBy,
        products: order.products.map(p => convertToProductView(p)),
        status: order.status,
        takeOutId: order.takeOutId
      })
    })
  }

  ofId(id: string): Promise<OrderView> {
    return this.repository.ofId(id)
  }

  ofUserId(userId: string): Promise<OrderView[]> {
    return this.repository.ofUserId(userId)
  }

  async save(orderView: OrderView): Promise<void> {
    return this.repository.save(orderView)
  }

  async ofPage({
    page,
    count
  }: {
    page: number
    count: number
  }): Promise<{
    orders: OrderView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }> {
    return this.repository.ofPage({ page, count })
  }
}
