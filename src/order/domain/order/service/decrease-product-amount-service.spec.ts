import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { Order, OrderStatus } from "../order"
import { Product } from "../product"
import { DecreaseProductAmountService } from "./decrease-product-amount-service"

describe("decrease product amount service", () => {
  it("should pass", async () => {
    const orderRepository = new InMemoryOrderRepository()
    const decreaseProductAmountService = new DecreaseProductAmountService({
      orderRepository
    })

    const orderId = await orderRepository.nextId()

    const order = new Order(orderId, {
      createdBy: "ricky",
      orderedProducts: [
        new Product({
          id: "p0",
          amount: 2,
          note: ""
        })
      ],
      status: OrderStatus.pended
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
    let error
    try {
      const orderRepository = new InMemoryOrderRepository()
      const decreaseProductAmountService = new DecreaseProductAmountService({
        orderRepository
      })

      const orderId = await orderRepository.nextId()

      const order = new Order(orderId, {
        createdBy: "ricky",
        orderedProducts: [],
        status: OrderStatus.pended
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
