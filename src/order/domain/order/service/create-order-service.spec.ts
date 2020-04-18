import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { CreateOrderService } from "./create-order.service"
import { OrderEventPublisher } from "../event/order-event-publisher"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"

describe("create order service", () => {
  it("should pass", async () => {
    const orderRepository = new InMemoryOrderRepository()
    const orderEventPublisher = new OrderEventPublisher(
      new SynchronizedDomainEventPublisher()
    )
    const createOrderService = new CreateOrderService({
      orderRepository,
      eventPublisher: orderEventPublisher
    })

    const orderId = await createOrderService.create({
      userId: "ricky",
      takeOutId: "0"
    })

    expect(orderId).toBeDefined()
  })

  it("should fail for empty userId", async () => {
    try {
      const orderRepository = new InMemoryOrderRepository()
      const orderEventPublisher = new OrderEventPublisher(
        new SynchronizedDomainEventPublisher()
      )
      const createOrderService = new CreateOrderService({
        orderRepository,
        eventPublisher: orderEventPublisher
      })

      const orderId = await createOrderService.create({
        userId: "",
        takeOutId: "0"
      })
    } catch (e) {
      expect(e).toBeDefined()
    }
  })
})
