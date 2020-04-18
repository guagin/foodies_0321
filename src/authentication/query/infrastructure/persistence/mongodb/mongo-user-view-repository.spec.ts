import { MongoUserViewRepository } from "./mongo-user-view-repository"
import mongoose from "mongoose"

describe("mongo user view repository save", () => {
  it("should pass", async () => {
    const mongoURL = process.env.mongo_url
    await mongoose.connect(mongoURL)
    const userViewRepository = new MongoUserViewRepository(mongoose.connection)

    await userViewRepository.save({
      id: "1234",
      name: "12345",
      email: "123456",
      version: 0
    })

    const user = await userViewRepository.ofId("1234")

    user.name = "666"

    await userViewRepository.save(user)

    const updatedUser = await userViewRepository.ofId("1234")

    expect(updatedUser.name).toEqual("666")
  })
})
