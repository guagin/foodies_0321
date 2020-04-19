import { InMemoryOrderRepository } from "order/command/intrastructure/persistence/in-memory-oder-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Order, OrderStatus } from "order/command/domain/order/order"
import { Product } from "order/command/domain/order/product"
import { PlaceOrder } from "./place-order"
import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory-take-out-repository"
import { TakeOut } from "order/command/domain/take-out/take-out"

const Day = 1000 * 60 * 60 * 24

describe("place order", () => {
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

    const orderId = await orderRepository.nextId()
    const order = new Order(orderId, {
      createdBy: "ricky",
      orderedProducts: [
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

    const placeOrder = new PlaceOrder({
      orderRepository,
      eventPublisher
    })

    await placeOrder.place(orderId.toValue())

    const placedOrder = await orderRepository.ofId(orderId)

    expect(placedOrder).toBeDefined()
    expect(placedOrder.status).toBe(OrderStatus.placed)
  })
})
