import mongoose from "mongoose"
import faker from "faker"
import { MongoTakeOutViewRepository } from "order/query/infrastructure/mongo-take-out-view-repository"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"

describe("take out view of page", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)
    const repository = new MongoTakeOutViewRepository(mongoose.connection)

    // insert serveral take outs
    const takeOuts: TakeOutView[] = [
      {
        id: faker.random.uuid(),
        title: faker.random.word(),
        createdBy: faker.random.word(),
        description: faker.random.word(),
        startedAt: new Date(),
        endAt: new Date(),
        enabled: true
      },
      {
        id: faker.random.uuid(),
        title: faker.random.word(),
        createdBy: faker.random.word(),
        description: faker.random.word(),
        startedAt: new Date(),
        endAt: new Date(),
        enabled: true
      },
      {
        id: faker.random.uuid(),
        title: faker.random.word(),
        createdBy: faker.random.word(),
        description: faker.random.word(),
        startedAt: new Date(),
        endAt: new Date(),
        enabled: true
      }
    ]

    const ids = takeOuts.map(takeOut => takeOut.id)

    const saveTakeOutsPromise: Promise<void>[] = []
    takeOuts.forEach(takeOut => {
      saveTakeOutsPromise.push(repository.save(takeOut))
    })

    await Promise.all(saveTakeOutsPromise)

    // query of page.
    const ofPageTakeOuts = await repository.ofPage({ toPage: 1, count: 1 })

    expect(ofPageTakeOuts.hasNext).toBe(true)
    expect(ofPageTakeOuts.hasPrevious).toBe(false)
    expect(ofPageTakeOuts.page).toBe(1)
    expect(ofPageTakeOuts.totalCount).toBe(3)
    expect(ofPageTakeOuts.totalPages).toBe(3)

    await repository.remove(ids)
  })
})
