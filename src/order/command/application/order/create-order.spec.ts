import { InMemoryOrderRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-oder-repository"

import { CreateOrder } from "./create-order"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-take-out-repository"
import { TakeOut } from "order/command/domain/take-out/model/take-out"
import { OrderCreated } from "event/order"

const Day = 1000 * 60 * 60 * 24

describe("create order", () => {
  it("should pass", async () => {
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const promiseToFetchOderIdByEvent = new Promise<string>(resolve => {
      eventPublisher.register<OrderCreated>("OrderCreated", e => {
        resolve(e.payload.orderId)
      })
    })
    const orderRepository = new InMemoryOrderRepository()

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

    const createOrder = new CreateOrder({
      orderRepository,
      takeOutRepository,
      eventPublisher
    })

    const orderId = await createOrder
      .createBy("ricky")
      .appendTo(takeOut.id.toValue())

    const order = await orderRepository.ofId(orderId)

    expect(order).toBeDefined()

    const orders = await orderRepository.ofUserId("ricky")

    expect(orders).toBeDefined()
    expect(orders.length).toBeGreaterThan(0)

    // expect to receive event.
    const orderIdReceiveFromEvent = await promiseToFetchOderIdByEvent
    expect(orderIdReceiveFromEvent).toBe(order.id.toValue())
  })
})
