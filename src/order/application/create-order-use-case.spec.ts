import { InMemoryOrderRepository } from "order/intrastructure/persistence/in-memory-oder-repository"
import { CreateOrderUseCase } from "./create-order-use-case"

describe("create order application", () => {
  it("should pass", async () => {
    const orderRepository = new InMemoryOrderRepository()
    const createOrderUseCase = new CreateOrderUseCase({
      orderRepository
    })

    const { success, errorMessage, orderId } = await createOrderUseCase.create({
      userId: "ricky"
    })
    expect(success).toBeTruthy()
    expect(errorMessage).toBeUndefined()
    expect(orderId).toBeDefined()

    const order = await orderRepository.ofId(orderId)
    expect(order).toBeDefined()
  })

  it("should fail for userId empty", async () => {
    const orderRepository = new InMemoryOrderRepository()
    const createOrderUseCase = new CreateOrderUseCase({
      orderRepository
    })

    const { success, errorMessage, orderId } = await createOrderUseCase.create({
      userId: ""
    })

    expect(success).toBeFalsy()
    expect(errorMessage).toBeDefined()
    expect(orderId).toBeUndefined()
  })
})
