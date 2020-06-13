import mongoose from "mongoose"
import faker from "faker"
import { MongoMealViewRepository } from "order/query/infrastructure/mongo-meal-view-repository"
import { MealStatus } from "order/command/domain/meal/model/meal"
import { MealViewOfProvider } from "./of-provider"

describe("meal of provider", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)
    const repository = new MongoMealViewRepository(mongoose.connection)

    const id = faker.random.uuid()
    const name = faker.random.word()
    const price = faker.random.number()
    const description = faker.random.words(20)
    const pictures = [faker.random.word(), faker.random.word()]
    const status = MealStatus.preparing
    const provider = faker.random.uuid()

    const mealViewSample = {
      id,
      name,
      price,
      description,
      pictures,
      status,
      provider,
      createdBy: faker.random.word()
    }

    const mealViewSample2 = {
      id: faker.random.uuid(),
      name,
      price,
      description,
      pictures,
      status,
      provider,
      createdBy: faker.random.word()
    }

    await repository.save(mealViewSample)
    await repository.save(mealViewSample2)

    const mealOfProviderUseCase = new MealViewOfProvider(repository)
    const mealViews = await mealOfProviderUseCase.ofProvider(provider)

    expect(mealViews.length).toBeGreaterThan(0)
  })
})
