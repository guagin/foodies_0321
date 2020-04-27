import mongoose from "mongoose"
import { MongoEventStoreTakeOutRepository } from "./mongo-event-store-take-out-repository"
import { v4 as UUIDV4 } from "uuid"
import { TakeOut } from "order/command/domain/take-out/model/take-out"
import faker from "faker"

describe("mongo event store take out repository save", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)

    const repository = new MongoEventStoreTakeOutRepository(
      mongoose.connection,
      async () => UUIDV4()
    )

    const id = await repository.nextId()
    const createdBy = faker.random.uuid()
    const title = faker.random.words(3)
    const description = faker.random.words(20)

    const takeOut = new TakeOut(id, {
      createdBy,
      title,
      description,
      startedAt: new Date(),
      endAt: new Date(Date.now() + 60 * 60 * 1000),
      enabled: true
    })

    await repository.save(takeOut)

    const fetchTakeOut = await repository.ofId(id)

    expect(fetchTakeOut).toBeDefined()

    fetchTakeOut.disable()

    await repository.save(fetchTakeOut)

    const updatedTakeOut = await repository.ofId(id)

    expect(updatedTakeOut.enabled).toBeFalsy()
  })
})
