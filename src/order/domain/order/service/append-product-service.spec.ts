import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { Order, OrderStatus, OrderId } from "../order"
import { Product } from "../product"
import { AppendProductService } from "./append-product-service"
import { OrderEventPublisher } from "../event/order-event-publisher"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { InMemoryTakeOutRepository } from "order/intrastructure/persistence/in-memory-take-out-repository"
import {  TakeOut } from "order/domain/take-out/take-out"

const Day = 1000 * 60 * 60 * 24

describe("append product service", () => {
  it("should pass", async () => {
    const takeOutRepository = new InMemoryTakeOutRepository()
    const takeOutId = await takeOutRepository.nextId()
    const takeOut = new TakeOut(
      takeOutId,
      {
      createdBy: 'ricky',
      title: "lunch",
      description: "",
      startedAt: new Date(),
      endAt: new Date(Date.now() + Day),
      enabled: true
  })

  await takeOutRepository.save(takeOut)


    const orderRepository = new InMemoryOrderRepository()
    const eventPublisher = new OrderEventPublisher(new SynchronizedDomainEventPublisher())
    const appendProductService = new AppendProductService({
      orderRepository: orderRepository,
      eventPublisher
    })

    const orderId = await orderRepository.nextId()

    const order = new Order(orderId, {
      createdBy: "ricky",
      orderedProducts: [],
      status: OrderStatus.pended,
      takeOutId: takeOutId.toValue()
    })

    await orderRepository.save(order)

    const product = new Product({
      id: "p0",
      amount: 1,
      note: ""
    })

    await appendProductService.append(orderId, product)

    const updatedOrder = await orderRepository.ofId(orderId)
    expect(updatedOrder.products.length).toBe(1)
  })

  it("should fail for not exists order", async () => {
    let error
    try {
      const orderRepository = new InMemoryOrderRepository()
      const eventPublisher = new OrderEventPublisher(new SynchronizedDomainEventPublisher())
      const appendProductService = new AppendProductService({
        orderRepository: orderRepository,
        eventPublisher
      })

      const product = new Product({
        id: "p0",
        amount: 1,
        note: ""
      })

      await appendProductService.append(new OrderId("1"), product)
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.alias).toBe("ORDER_NOT_FOUND")
  })
})
