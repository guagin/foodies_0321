import { InMemoryMealRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-meal-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Meal, MealStatus } from "order/command/domain/meal/meal"
import { PrepareMeal } from "./prepare-meal"
import faker from "faker"

describe("prepare meal", () => {
  it("should pass", async () => {
    const mealRepository = new InMemoryMealRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()

    const mealId = await mealRepository.nextId()
    const meal = new Meal(mealId, {
      name: "RU_WEI",
      price: 100,
      description: "",
      pictures: [""],
      status: MealStatus.shelved,
      provider: "uber",
      createdBy: faker.random.word()
    })

    await mealRepository.save(meal)

    const prepareMeal = new PrepareMeal(mealRepository, eventPublisher)
    await prepareMeal.prepare(mealId.toValue())

    const preparingMeal = await mealRepository.ofId(mealId)
    expect(preparingMeal).toBeDefined()
    expect(preparingMeal.status).toBe(MealStatus.preparing)
  })
})
