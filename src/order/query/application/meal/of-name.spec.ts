import mongoose from "mongoose"
import { MongoMealViewRepository } from "order/query/infrastructure/mongo-meal-view-repository"
import faker from "faker"
import { MealView } from "order/query/domain/meal/meal-view"
import { MealStatus } from "order/command/domain/meal/model/meal"
import { MealViewOfName } from "./of-name"

describe("meals of name ", () => {
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

    const smapleMeal: MealView = {
      id,
      name,
      price,
      description,
      pictures,
      status,
      provider,
      createdBy: faker.random.word()
    }

    const id2 = faker.random.uuid()
    const smapleMeal2: MealView = {
      id: id2,
      name,
      price,
      description,
      pictures,
      status,
      provider,
      createdBy: faker.random.word()
    }

    await repository.save(smapleMeal)
    await repository.save(smapleMeal2)

    const ofNameUseCase = new MealViewOfName(repository)

    const mealViews = await ofNameUseCase.ofName(name)
    expect(mealViews.length).toBeGreaterThan(0)
  })

  it("should success but get 0 length array", async () => {
    await mongoose.connect(process.env.mongo_url)
    const repository = new MongoMealViewRepository(mongoose.connection)

    const id = faker.random.uuid()
    const name = faker.random.word()
    const price = faker.random.number()
    const description = faker.random.words(20)
    const pictures = [faker.random.word(), faker.random.word()]
    const status = MealStatus.preparing
    const provider = faker.random.uuid()

    const smapleMeal: MealView = {
      id,
      name,
      price,
      description,
      pictures,
      status,
      provider,
      createdBy: faker.random.word()
    }

    await repository.save(smapleMeal)

    const ofNameUseCase = new MealViewOfName(repository)

    const mealViews = await ofNameUseCase.ofName("123")
    expect(mealViews.length).toBe(0)
  })
})
