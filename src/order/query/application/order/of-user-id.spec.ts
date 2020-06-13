import faker from "faker"
import mongoose from "mongoose"
import { MongoOrderViewRepository } from "order/query/infrastructure/mongo-order-view-repository"
import { OrderView } from "order/query/domain/order/model/order-view"
import { OrderStatus } from "order/command/domain/order/model/order"
import { OrderViewOfUserId } from "./of-user-id"

describe("order of name", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)

    const repository = new MongoOrderViewRepository(mongoose.connection)

    const id = faker.random.uuid()
    const userId = faker.random.uuid()

    const sampleOrder: OrderView = {
      id,
      createdBy: userId,
      products: [
        {
          id: faker.random.uuid(),
          amount: faker.random.number(),
          note: faker.random.words(10)
        },
        {
          id: faker.random.uuid(),
          amount: faker.random.number(),
          note: faker.random.words(10)
        }
      ],
      status: OrderStatus.pended,
      takeOutId: faker.random.uuid()
    }

    await repository.save(sampleOrder)

    const orderOfUserId = new OrderViewOfUserId(repository)

    const orders = await orderOfUserId.ofUserId(userId)

    expect(orders.length).toBeGreaterThan(0)
  })
})
