import { InMemoryOrderRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-oder-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Order, OrderStatus } from "order/command/domain/order/model/order"
import { Product } from "order/command/domain/order/model/product"
import { AppendProduct } from "./append-product"
import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-take-out-repository"
import { TakeOut } from "order/command/domain/take-out/model/take-out"
import { ProductAppended } from "event/order"

const Day = 1000 * 60 * 60 * 24

describe("append product", () => {
  it("should pass", async () => {
    const orderRepository = new InMemoryOrderRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()

    const promiseToReceiveProductAppended = new Promise<
      {
        id: string
        amount: number
        note?: string
      }[]
    >(resolve => {
      eventPublisher.register<ProductAppended>("ProductAppended", e => {
        resolve(e.payload.products)
      })
    })

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

    const orderId = await orderRepository.nextId()
    const order = new Order(orderId, {
      createdBy: "ricky",
      takeOutId: takeOutId.toValue(),
      products: [
        new Product({
          id: "p0",
          amount: 1,
          note: ""
        })
      ],
      status: OrderStatus.pended
    })

    await orderRepository.save(order)

    const appendProductUsecase = new AppendProduct({
      orderRepository,
      eventPublisher
    })

    await appendProductUsecase
      .append([
        new Product({
          id: "p0",
          amount: 100,
          note: ""
        }),
        new Product({
          id: "p1",
          amount: 100,
          note: ""
        })
      ])
      .to(orderId.toValue())

    const updateOrder = await orderRepository.ofId(orderId)
    expect(updateOrder.products.length).toBe(2)
    expect(updateOrder.products[0].amount).toBe(101)
    expect(updateOrder.products).toStrictEqual([
      new Product({
        id: "p0",
        amount: 101,
        note: ""
      }),
      new Product({
        id: "p1",
        amount: 100,
        note: ""
      })
    ])

    const productAppendedReceiveFromPromise = await promiseToReceiveProductAppended
    expect(productAppendedReceiveFromPromise).toStrictEqual([
      new Product({
        id: "p0",
        amount: 101,
        note: ""
      }),
      new Product({
        id: "p1",
        amount: 100,
        note: ""
      })
    ])
  })
})
