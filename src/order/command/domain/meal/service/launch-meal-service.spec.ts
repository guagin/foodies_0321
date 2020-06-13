import { InMemoryMealRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-meal-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { MealEventPublisher } from "../../../../../event/meal-event-publisher"

import { LaunchMealService } from "./launch-meal-service"
import { Meal, MealStatus } from "../model/meal"
import faker from "faker"
import { MealLaunched } from "event/meal"

describe("launch meal", () => {
  it("should pass", async () => {
    const mealRepository = new InMemoryMealRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()

    const eventPromise = new Promise<string>(resolve => {
      eventPublisher.register<MealLaunched>("MealLaunched", e => {
        resolve(e.payload.meal.id)
      })
    })

    const mealEventPublisher = new MealEventPublisher(eventPublisher)

    const mealId = await mealRepository.nextId()

    const meal = new Meal(mealId, {
      name: "RU_WEI",
      price: 100,
      description: "good",
      pictures: [""],
      provider: "uber",
      status: MealStatus.preparing,
      createdBy: faker.random.word()
    })

    await mealRepository.save(meal)

    const launchMeal = new LaunchMealService(mealRepository, mealEventPublisher)

    await launchMeal.launch(mealId)

    const launchedMeal = await mealRepository.ofId(mealId)
    expect(launchedMeal.status).toBe(MealStatus.launched)

    const mealIdFromEvent = await eventPromise
    expect(mealIdFromEvent).toBe(mealId.toValue())
  })
})
