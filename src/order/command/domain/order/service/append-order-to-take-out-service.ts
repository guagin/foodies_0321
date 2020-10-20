import { OrderRepository } from "../model/order-repository"
import { OrderEventPublisher } from "../../../../../event/order-event-publisher"
import { TakeOutRepository } from "order/command/domain/take-out/model/take-out-repository"
import { OrderId } from "../model/order"
import { OrderNotFound } from "../error/order-not-found"
import { TakeOutId } from "order/command/domain/take-out/model/take-out"
import { DomainError } from "domain-error"

export class AppendOrderToTakeOutService {
  private orderId: string
  constructor(
    private orderRepository: OrderRepository,
    private takeOutRepository: TakeOutRepository,
    private orderEventPublisher: OrderEventPublisher
  ) {}

  append(orderId: string): AppendOrderToTakeOutService {
    this.orderId = orderId
    return this
  }

  async to(takeOutId: string): Promise<void> {
    const order = await this.orderRepository.ofId(new OrderId(this.orderId))
    if (!order) {
      throw new OrderNotFound()
    }
    //
    const takeOut = await this.takeOutRepository.ofId(new TakeOutId(takeOutId))
    if (!takeOut) {
      throw new DomainError({
        message: "TAKE_OUT_NOT_FOUND",
        payload: {
          takeOutId
        }
      })
    }

    if (!takeOut.isAvailable(new Date())) {
      throw new DomainError({
        message: "TAKE_OUT_IS_EXPIRED",
        payload: {
          takeOutId
        }
      })
    }

    order.appendTo(takeOutId)

    this.orderEventPublisher.orderAppended(order)

    await this.orderRepository.save(order)
  }
}
