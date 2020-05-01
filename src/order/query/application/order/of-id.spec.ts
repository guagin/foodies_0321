import faker from "faker"
import mongoose from "mongoose"
import { MongoOrderViewRepository } from "order/query/infrastructure/mongo-order-view-repository"
import { OrderView } from "order/query/domain/order/model/order-view"
import { OrderStatus } from "order/command/domain/order/model/order"
import { OrderViewOfId } from "./of-id"

describe("order view of id", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)

    const repository = new MongoOrderViewRepository(mongoose.connection)

    const id = faker.random.uuid()

    const sampleOrderView: OrderView = {
      id,
      createdBy: faker.random.uuid(),
      orderProducts: [
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

    await repository.save(sampleOrderView)

    const orderViewOfId = new OrderViewOfId(repository)

    const orderView = await orderViewOfId.ofId(id)

    expect(orderView).toBeDefined()
  })

  it("should failed for not exists id", async () => {
    await mongoose.connect(process.env.mongo_url)

    const repository = new MongoOrderViewRepository(mongoose.connection)

    const id = faker.random.uuid()

    const sampleOrderView: OrderView = {
      id,
      createdBy: faker.random.uuid(),
      orderProducts: [
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

    await repository.save(sampleOrderView)

    const orderViewOfId = new OrderViewOfId(repository)

    let error: Error
    try {
      const orderView = await orderViewOfId.ofId("123")
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
  })
})
