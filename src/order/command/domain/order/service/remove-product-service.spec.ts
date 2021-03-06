import { InMemoryOrderRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-oder-repository"
import { Order, OrderStatus } from "../model/order"
import { Product } from "../model/product"
import { RemoveProductService } from "./remove-product-service"
import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-take-out-repository"
import { TakeOut } from "order/command/domain/take-out/model/take-out"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { OrderEventPublisher } from "../../../../../event/order-event-publisher"

const Day = 1000 * 60 * 60 * 24

describe("remove product service", () => {
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

    const removeProductService = new RemoveProductService({
      orderRepository,
      eventPublisher: new OrderEventPublisher(eventPublisher)
    })

    const orderId = await orderRepository.nextId()
    const order = new Order(orderId, {
      createdBy: "ricky",
      products: [
        new Product({
          id: "p0",
          amount: 100,
          note: ""
        })
      ],
      status: OrderStatus.pended,
      takeOutId: takeOutId.toValue()
    })

    await orderRepository.save(order)

    await removeProductService.remove(orderId, [{ id: "p0", amount: 100 }])

    const updatedOrder = await orderRepository.ofId(orderId)
    expect(updatedOrder.products.length).toBe(0)
  })
})
