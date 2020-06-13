import { MealStatus, Meal } from "../meal"
import { InMemoryMealRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-meal-repository"
import { MealShelved } from "event/meal-shelved"
import { MealEventPublisher } from "../meal-event-publisher"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { PrepareMealService } from "./prepare-meal-service"
import faker from "faker"

describe("prepare meal service", () => {
  it("should pass", async () => {
    const mealRepository = new InMemoryMealRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()

    const eventPromise = new Promise<string>(resolve => {
      eventPublisher.register<MealShelved>("MealPrepared", e => {
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
      status: MealStatus.shelved,
      createdBy: faker.random.word()
    })

    await mealRepository.save(meal)

    const prepareMeal = new PrepareMealService(
      mealRepository,
      mealEventPublisher
    )

    await prepareMeal.prepare(mealId)

    const preparingMeal = await mealRepository.ofId(mealId)
    expect(preparingMeal).toBeDefined()
    expect(preparingMeal.status).toBe(MealStatus.preparing)

    const mealIdFromEvent = await eventPromise

    expect(mealIdFromEvent).toBe(mealId.toValue())
  })
})
