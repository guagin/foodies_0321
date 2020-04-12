import { User } from "authentication/domain/user/model/user"
import { v4 as uuidV4 } from "uuid"
import mongoose from "mongoose"
import { MongoEventStoreUserRepository } from "./event-store-user-repository"

let mongoConnection = mongoose.connection

describe("event store user repository save", () => {
  beforeAll(() => {
    const mongoURL = process.env.mongo_url
    mongoose.connect(mongoURL)
  })
  it("should pass", async () => {
    const mongoEventStoreUserRepository = new MongoEventStoreUserRepository({
      connection: mongoConnection,
      generateUUID: () => {
        return uuidV4()
      }
    })

    const userId = await mongoEventStoreUserRepository.nextId()

    await mongoEventStoreUserRepository.save(
      new User(
        userId,
        {
          name: "ricky",
          password: "123456",
          email: "123"
        },
        (value: string) => value,
        (value: string) => value
      )
    )

    const user = await mongoEventStoreUserRepository.ofId(userId)
    expect(user).toBeDefined()
    expect(user.id).toEqual(userId)
  })
})

describe("event store user repository save(update usage)", () => {})

describe("event store user repository ofId", () => {})

describe("event store user repository ofName", () => {})
