import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { Order, OrderStatus } from "../order"
import { Product } from "../product"
import { RemoveProductService } from "./remove-product-service"

describe("remove product service", () => {
  it("should pass", async () => {
    const orderRepository = new InMemoryOrderRepository()

    const removeProductService = new RemoveProductService({ orderRepository })

    const orderId = await orderRepository.nextId()
    const order = new Order(orderId, {
      createdBy: "ricky",
      orderedProducts: [
        new Product({
          id: "p0",
          amount: 100,
          note: ""
        })
      ],
      status: OrderStatus.pended
    })
    await orderRepository.save(order)

    await removeProductService.remove(orderId, "p0")

    const updatedOrder = await orderRepository.ofId(orderId)
    expect(updatedOrder.products.length).toBe(0)
  })
})
