import { InMemoryOrderRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-oder-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Order, OrderStatus } from "order/command/domain/order/model/order"
import { Product } from "order/command/domain/order/model/product"
import { RemoveProduct } from "./remove-product"
import { ProductRemoved } from "event/product-removed"
import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-take-out-repository"
import { TakeOut } from "order/command/domain/take-out/model/take-out"

const Day = 1000 * 60 * 60 * 24

describe("remove product", () => {
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

    const promiseToRemoveProduct = new Promise<
      {
        id: string
        amount: number
        note?: string
      }[]
    >(resolve => {
      eventPublisher.register<ProductRemoved>("ProductRemoved", e => {
        resolve(e.payload.products)
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

    const removeProduct = new RemoveProduct({
      orderRepository,
      eventPublisher
    })

    await removeProduct
      .remove([
        {
          id: "p0",
          amount: 1
        },
        {
          id: "p1",
          amount: 1
        },
        {
          id: "p2",
          amount: 1
        }
      ])
      .from(orderId.toValue())

    const updatedOrder = await orderRepository.ofId(orderId)
    expect(updatedOrder.products).toStrictEqual([
      new Product({
        id: "p0",
        amount: 99,
        note: ""
      }),
      new Product({
        id: "p1",
        amount: 99,
        note: ""
      })
    ])

    const receivedProductFromEvent = await promiseToRemoveProduct
    expect(receivedProductFromEvent).toStrictEqual([
      new Product({
        id: "p0",
        amount: 99,
        note: ""
      }),
      new Product({
        id: "p1",
        amount: 99,
        note: ""
      })
    ])
  })
})
