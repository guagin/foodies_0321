import { User } from "authentication/command/domain/user/model/user"
import { v4 as uuidV4 } from "uuid"
import mongoose from "mongoose"
import { MongoEventStoreUserRepository } from "./event-store-user-repository"
import faker from "faker"

const mongoConnection = mongoose.connection

describe("event store user repository save", () => {
  beforeAll(async () => {
    const mongoURL = process.env.mongo_url
    await mongoose.connect(mongoURL)
  })
  it("should pass", async () => {
    const mongoEventStoreUserRepository = new MongoEventStoreUserRepository({
      connection: mongoConnection,
      generateUUID: () => {
        return uuidV4()
      }
    })

    const userId = await mongoEventStoreUserRepository.nextId()

    const userToCreate = new User(
      userId,
      {
        name: faker.name.firstName(),
        password: faker.random.words(16),
        email: faker.random.words(16)
      },
      (value: string) => value,
      (value: string) => value
    )

    await mongoEventStoreUserRepository.save(userToCreate)

    const user = await mongoEventStoreUserRepository.ofId(userId)
    expect(user).toBeDefined()
    expect(user.id).toEqual(userId)
  })
})

describe("event store user repository save(update usage)", () => {
  it("should pass", async () => {
    const mongoEventStoreUserRepository = new MongoEventStoreUserRepository({
      connection: mongoConnection,
      generateUUID: () => {
        return uuidV4()
      }
    })

    const userId = await mongoEventStoreUserRepository.nextId()

    const userToCreate = new User(
      userId,
      {
        name: faker.name.firstName(),
        password: faker.random.words(16),
        email: faker.random.words(16)
      },
      (value: string) => value,
      (value: string) => value
    )

    await mongoEventStoreUserRepository.save(userToCreate)

    const user = await mongoEventStoreUserRepository.ofId(userId)

    user.changeEmail("123456")

    await mongoEventStoreUserRepository.save(user)

    const updatedUser = await mongoEventStoreUserRepository.ofId(user.id)

    expect(updatedUser.id.equals(user.id)).toBeTruthy()
    expect(updatedUser).toBeDefined()
    expect(updatedUser.email).toEqual("123456")
  })
})
