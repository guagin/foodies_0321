import faker from "faker"
import mongoose from "mongoose"
import { MongoTakeOutViewRepository } from "order/query/infrastructure/mongo-take-out-view-repository"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"
import { TakeOutViewOfUserId } from "./of-user-id"

describe("take out view of user id", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)
    const repository = new MongoTakeOutViewRepository(mongoose.connection)

    const userId = faker.random.uuid()

    const sampleTakeOutView: TakeOutView = {
      id: faker.random.uuid(),
      title: faker.random.words(10),
      createdBy: userId,
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(),
      enabled: true
    }

    await repository.save(sampleTakeOutView)

    const takeOutOfUserId = new TakeOutViewOfUserId(repository)

    const takeOutViews = await takeOutOfUserId.ofUserId(userId)

    expect(takeOutViews.length).toBeGreaterThan(0)

    repository.remove([sampleTakeOutView.id])
  })

  it("should failed for not exists user id", async () => {
    await mongoose.connect(process.env.mongo_url)
    const repository = new MongoTakeOutViewRepository(mongoose.connection)

    const takeOutOfUserId = new TakeOutViewOfUserId(repository)

    const takeOutViews = await takeOutOfUserId.ofUserId("123")

    expect(takeOutViews.length).toBe(0)
  })
})
