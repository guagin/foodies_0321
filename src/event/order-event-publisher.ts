import { Order } from "../order/command/domain/order/model/order"
import { DomainEventPublisher } from "event/domain-event-publisher"
import {
  OrderCreated,
  OrderPlaced,
  OrderCanceled,
  OrderAppended,
  ProductAppended,
  ProductRemoved
} from "event/order"

export class OrderEventPublisher {
  private applicationVeriosn = process.env.applicationVeriosn || "0.0.0.0"
  constructor(private eventPublisher: DomainEventPublisher) {}

  orderCreated(order: Order): void {
    const event = new OrderCreated(
      {
        userId: order.createdBy,
        orderId: order.id.toValue(),
        products: order.products
      },
      this.applicationVeriosn
    )
    this.eventPublisher.publish(event)
  }

  productAppended(order: Order): void {
    const event = new ProductAppended(
      {
        userId: order.createdBy,
        orderId: order.id.toValue(),
        products: order.products
      },
      this.applicationVeriosn
    )
    this.eventPublisher.publish(event)
  }

  productRemoved(order: Order): void {
    const event = new ProductRemoved(
      {
        userId: order.createdBy,
        orderId: order.id.toValue(),
        products: order.products
      },
      this.applicationVeriosn
    )
    this.eventPublisher.publish(event)
  }

  orderPlaced(order: Order): void {
    const event = new OrderPlaced(
      {
        userId: order.createdBy,
        orderId: order.id.toValue(),
        products: order.products
      },
      this.applicationVeriosn
    )
    this.eventPublisher.publish(event)
  }

  orderCanceled(order: Order): void {
    const event = new OrderCanceled(
      {
        userId: order.createdBy,
        orderId: order.id.toValue(),
        products: order.products
      },
      this.applicationVeriosn
    )
    this.eventPublisher.publish(event)
  }

  orderAppended(order: Order): void {
    const event = new OrderAppended(
      {
        userId: order.createdBy,
        orderId: order.id.toValue(),
        takeOutId: order.takeOutId
      },
      this.applicationVeriosn
    )
    this.eventPublisher.publish(event)
  }
}
