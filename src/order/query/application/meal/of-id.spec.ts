import mongoose from "mongoose"
import { MongoMealViewRepository } from "order/query/infrastructure/mongo-meal-view-repository"
import faker from "faker"
import { MealViewOfIdUseCase } from "./of-id"

describe("mealView of id", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)
    const repository = new MongoMealViewRepository(mongoose.connection)

    const mealId = faker.random.uuid()

    await repository.save({
      id: mealId,
      name: faker.name.lastName(),
      price: faker.random.number(),
      description: faker.random.word(),
      pictures: [faker.image.imageUrl(), faker.image.imageUrl()],
      status: 0,
      provider: faker.random.uuid()
    })

    const mealOfIdUseCase = new MealViewOfIdUseCase(repository)

    const mealView = await mealOfIdUseCase.ofId(mealId)

    expect(mealView).toBeDefined()
  })

  it("should failed for not exists id.", async () => {
    await mongoose.connect(process.env.mongo_url)
    const repository = new MongoMealViewRepository(mongoose.connection)

    const mealId = faker.random.uuid()

    const mealOfIdUseCase = new MealViewOfIdUseCase(repository)
    let error: Error
    try {
      const mealView = await mealOfIdUseCase.ofId(mealId)
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
  })
})
