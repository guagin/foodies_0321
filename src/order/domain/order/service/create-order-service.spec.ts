import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { CreateOrderService } from "./create-order.service"

describe("create order service", () => {
  it("should pass", async () => {
    const orderRepository = new InMemoryOrderRepository()
    const createOrderService = new CreateOrderService({ orderRepository })

    const orderId = await createOrderService.create({
      userId: "ricky"
    })

    expect(orderId).toBeDefined()
  })

  it("should fail for empty userId", async () => {
    try {
      const orderRepository = new InMemoryOrderRepository()
      const createOrderService = new CreateOrderService({ orderRepository })

      const orderId = await createOrderService.create({
        userId: ""
      })
    } catch (e) {
      expect(e).toBeDefined()
    }
  })
})
