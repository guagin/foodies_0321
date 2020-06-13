


import { InMemoryOrderRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-oder-repository"
import { OrderEventPublisher } from "../order-event-publisher"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Order, OrderStatus } from "../model/order"
import { Product } from "../model/product"
import { CancelOrderService } from "./cancel-order-service"
import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-take-out-repository"
import { TakeOut } from "order/command/domain/take-out/model/take-out"
import { OrderCanceled } from "event/order"

const Day = 1000 * 60 * 60 * 24

describe("cancel order service", () => {
  it("should pass", async () => {
    const takeOutRepository = new InMemoryTakeOutRepository()
    const takeOutId = await takeOutRepository.nextId()
    const takeOut = new TakeOut(takeOutId, {
      createdBy: "ricky",
      title: "lunch",
      description: "",
      startedAt: new Date(),
      endAt: new Date(Date.now() + Day),
      enabled: true
    })

    await takeOutRepository.save(takeOut)

    const orderRepository = new InMemoryOrderRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const orderEventPublisher = new OrderEventPublisher(eventPublisher)

    const eventPromise = new Promise<string>(resolve => {
      eventPublisher.register<OrderCanceled>("OrderCanceled", e => {
        resolve(e.payload.orderId)
      })
    })

    const orderId = await orderRepository.nextId()

    const order = new Order(orderId, {
      createdBy: "ricky",
      products: [
        new Product({
          id: "p0",
          amount: 2,
          note: ""
        })
      ],
      status: OrderStatus.placed,
      takeOutId: takeOutId.toValue()
    })

    await orderRepository.save(order)

    const cancelOrderService = new CancelOrderService({
      orderRepository,
      orderEventPublisher
    })

    await cancelOrderService.cancel(orderId.toValue())

    const cancelOrder = await orderRepository.ofId(orderId)

    expect(cancelOrder).toBeDefined()
    expect(cancelOrder.status).toBe(OrderStatus.canceled)

    const orderIdFromEvent = await eventPromise
    expect(orderIdFromEvent).toBe(orderId.toValue())
  })
})
