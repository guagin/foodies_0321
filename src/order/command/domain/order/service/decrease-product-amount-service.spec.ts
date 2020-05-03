import { InMemoryOrderRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-oder-repository"
import { Order, OrderStatus } from "../model/order"
import { Product } from "../model/product"
import { DecreaseProductAmountService } from "./decrease-product-amount-service"
import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-take-out-repository"
import { TakeOut } from "order/command/domain/take-out/model/take-out"

const Day = 1000 * 60 * 60 * 24

describe("decrease product amount service", () => {
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
    const decreaseProductAmountService = new DecreaseProductAmountService({
      orderRepository
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
      status: OrderStatus.pended,
      takeOutId: takeOutId.toValue()
    })

    await orderRepository.save(order)

    await decreaseProductAmountService.decrease(orderId, {
      id: "p0",
      amount: 1
    })
    const updatedOrder = await orderRepository.ofId(orderId)
    const product = updatedOrder.products.find(elem => elem.id === "p0")
    expect(product.amount).toBe(1)
  })

  it("should fail for product not found", async () => {
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
    let error
    try {
      const orderRepository = new InMemoryOrderRepository()
      const decreaseProductAmountService = new DecreaseProductAmountService({
        orderRepository
      })

      const orderId = await orderRepository.nextId()

      const order = new Order(orderId, {
        createdBy: "ricky",
        products: [],
        status: OrderStatus.pended,
        takeOutId: takeOutId.toValue()
      })

      await orderRepository.save(order)

      await decreaseProductAmountService.decrease(orderId, {
        id: "p0",
        amount: 1
      })
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    expect(error.alias).toBe("PRODUCT_NOT_FOUND")
  })
})
