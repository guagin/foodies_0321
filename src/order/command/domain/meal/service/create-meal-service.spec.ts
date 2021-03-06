import { InMemoryMealRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-meal-repository"
import { MealEventPublisher } from "../../../../../event/meal-event-publisher"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"

import { CreateMealService } from "./create-meal-service"
import faker from "faker"
import { MealPrepared } from "event/meal"

describe("create meal", () => {
  it("should pass", async () => {
    const mealRepository = new InMemoryMealRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const mealEventPublisher = new MealEventPublisher(eventPublisher)

    const eventPromise = new Promise<string>(resolve => {
      eventPublisher.register<MealPrepared>("MealPrepared", e => {
        resolve(e.payload.meal.id)
      })
    })

    const mealCreateService = new CreateMealService({
      mealRepository,
      mealEventPublisher
    })

    const mealId = await mealCreateService.create({
      name: "RU_WEI",
      price: 100,
      description: "good",
      pictures: [""],
      provider: "uber",
      createdBy: faker.random.word()
    })

    const meal = await mealRepository.ofId(mealId)
    expect(meal).toBeDefined()

    const mealIdFromEvent = await eventPromise
    expect(mealIdFromEvent).toBe(meal.id.toValue())
  })
})
