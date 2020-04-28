import mongoose from "mongoose"
import { MongoEventStoreMealRepository } from "./mongo-event-store-meal-repository"
import { v4 as UUIDv4 } from "uuid"
import { Meal, MealStatus } from "order/command/domain/meal/meal"
import faker from "faker"

describe("mongo event store meal repository save", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)

    const repository = new MongoEventStoreMealRepository(
      mongoose.connection,
      () => {
        return UUIDv4()
      }
    )

    const id = await repository.nextId()
    const name = faker.name.firstName()
    const price = faker.random.number()
    const description = faker.random.word()

    const pictures: string[] = []
    for (let i = 100; i > 0; i--) {
      pictures.push(faker.internet.url())
    }

    const provider = faker.random.word()

    const meal = new Meal(id, {
      name,
      price,
      description,
      pictures,
      status: MealStatus.preparing,
      provider
    })

    await repository.save(meal)

    meal.launch()

    await repository.save(meal)

    const updatedMeal = await repository.ofId(meal.id)

    console.log(`updatedMeal: ${updatedMeal}`)
    expect(updatedMeal).toBeDefined()
    expect(updatedMeal.status).toBe(MealStatus.launched)
  })
})
