import mongoose from "mongoose"
import { MongoTakeOutViewRepository } from "order/query/infrastructure/mongo-take-out-view-repository"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"
import faker from "faker"
import { TakeOutViewOfId } from "./of-id"

describe("take out view of id", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)
    const repository = new MongoTakeOutViewRepository(mongoose.connection)

    const id = faker.random.uuid()

    const sampleTakeOut: TakeOutView = {
      id,
      title: faker.random.words(10),
      createdBy: faker.random.uuid(),
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(),
      enabled: true
    }

    await repository.save(sampleTakeOut)

    const takeOutViewOfId = new TakeOutViewOfId(repository)

    const takeOutView = takeOutViewOfId.ofId(id)

    expect(takeOutView).toBeDefined()
  })

  it("should failed for not exsits id", async () => {
    await mongoose.connect(process.env.mongo_url)
    const repository = new MongoTakeOutViewRepository(mongoose.connection)

    const takeOutViewOfId = new TakeOutViewOfId(repository)

    let error: Error

    try {
      await takeOutViewOfId.ofId("12345")
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
  })
})
