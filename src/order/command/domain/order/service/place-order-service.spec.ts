import { InMemoryOrderRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-oder-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Order, OrderStatus } from "order/command/domain/order/model/order"
import { Product } from "order/command/domain/order/model/product"
import { OrderEventPublisher } from "../../../../../event/order-event-publisher"
import { PlaceOrderService } from "./place-order-service"

import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-take-out-repository"
import { TakeOut } from "order/command/domain/take-out/model/take-out"
import { OrderPlaced } from "event/order"

const Day = 1000 * 60 * 60 * 24

describe("place order service", () => {
  it("should success", async () => {
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

    const eventPromise = new Promise<string>(resolve => {
      eventPublisher.register<OrderPlaced>("OrderPlaced", e => {
        resolve(e.payload.orderId)
      })
    })

    const orderId = await orderRepository.nextId()
    const order = new Order(orderId, {
      createdBy: "ricky",
      products: [
        new Product({
          id: "p0",
          amount: 100,
          note: ""
        }),
        new Product({
          id: "p1",
          amount: 100,
          note: ""
        }),
        new Product({
          id: "p2",
          amount: 1,
          note: ""
        })
      ],
      status: OrderStatus.pended,
      takeOutId: takeOutId.toValue()
    })

    await orderRepository.save(order)

    const placeOrder = new PlaceOrderService({
      orderRepository,
      orderEventPublisher: new OrderEventPublisher(eventPublisher)
    })

    await placeOrder.place(orderId.toValue())

    const placedOrder = await orderRepository.ofId(orderId)

    expect(placedOrder).toBeDefined()
    expect(placedOrder.status).toBe(OrderStatus.placed)

    const orderIdFromEvent = await eventPromise
    expect(orderIdFromEvent).toBe(orderId.toValue())
  })
})
