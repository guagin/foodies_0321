import { OrderRepository } from "order/command/domain/order/model/order-repository"

import { OrderId } from "order/command/domain/order/model/order"
import { CreateOrderService } from "order/command/domain/order/service/create-order-service"
import { DomainEventPublisher } from "event/domain-event-publisher"
import { OrderEventPublisher } from "event/order-event-publisher"
import { TakeOutRepository } from "order/command/domain/take-out/model/take-out-repository"
import { TakeOutNotFound } from "order/command/error/take-out-not-found"
import { TakeOutId } from "order/command/domain/take-out/model/take-out"
import { AppendOrderToTakeOutService } from "order/command/domain/order/service/append-order-to-take-out-service"

export class CreateOrder {
  private orderRepository: OrderRepository
  private takeOutRepository: TakeOutRepository
  private orderEventPublisher: OrderEventPublisher
  private userId: string

  constructor(depends: {
    orderRepository: OrderRepository
    takeOutRepository: TakeOutRepository
    eventPublisher: DomainEventPublisher
  }) {
    this.orderRepository = depends.orderRepository
    this.takeOutRepository = depends.takeOutRepository
    this.orderEventPublisher = new OrderEventPublisher(depends.eventPublisher)
  }

  createBy(userId: string): CreateOrder {
    this.userId = userId
    return this
  }

  async appendTo(takeOutId: string): Promise<OrderId> {
    // check if take out exists
    const takeOut = await this.takeOutRepository.ofId(new TakeOutId(takeOutId))
    if (!takeOut) {
      throw new TakeOutNotFound()
    }

    const createOrderService = new CreateOrderService({
      orderRepository: this.orderRepository,
      eventPublisher: this.orderEventPublisher
    })

    const orderId = await createOrderService.create({
      takeOutId,
      userId: this.userId
    })

    // TODO: if append fail, should remove order( compenstatory)
    const appendOrderService = new AppendOrderToTakeOutService(
      this.orderRepository,
      this.takeOutRepository,
      this.orderEventPublisher
    )

    await appendOrderService.append(orderId.toValue()).to(takeOutId)

    return orderId
  }
}
