import mongoose from "mongoose"
import { v4 as UUIDv4 } from "uuid"
import { MongoEventStoreOrderRepository } from "./mongo-event-store-order-repository"
import faker from "faker"
import { Order } from "order/command/domain/order/model/order"
import { Product } from "order/command/domain/order/model/product"

describe("mongo event store order repository update", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)

    const repository = new MongoEventStoreOrderRepository(
      mongoose.connection,
      () => {
        return UUIDv4()
      }
    )

    const orderId = await repository.nextId()
    const createdBy = faker.random.word()
    const takeOutId = faker.random.word()

    const order = new Order(orderId, {
      createdBy: createdBy,
      orderedProducts: [],
      status: 0,
      takeOutId
    })

    await repository.save(order)

    order.appendProduct(
      new Product({
        id: "p01",
        amount: 1,
        note: ""
      })
    )

    await repository.save(order)

    const updated = await repository.ofId(orderId)

    expect(updated.products.length).toBe(1)
  })
})
