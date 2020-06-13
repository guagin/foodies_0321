import { InMemoryMealRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-meal-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { MealEventPublisher } from "../../../../../event/meal-event-publisher"
import { MealStatus, Meal } from "../model/meal"
import { ShelveMealService } from "./shelve-meal-service"
import faker from "faker"
import { MealShelved } from "event/meal"

describe("shelve meal service", () => {
  it("should pass", async () => {
    const mealRepository = new InMemoryMealRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()

    const eventPromise = new Promise<string>(resolve => {
      eventPublisher.register<MealShelved>("MealShelved", e => {
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
      status: MealStatus.launched,
      createdBy: faker.random.word()
    })

    await mealRepository.save(meal)

    const shelveMeal = new ShelveMealService(mealRepository, mealEventPublisher)

    await shelveMeal.shelve(mealId)

    const shelvedMeal = await mealRepository.ofId(mealId)
    expect(shelvedMeal).toBeDefined()
    expect(shelvedMeal.status).toBe(MealStatus.shelved)

    const mealIdFromEvent = await eventPromise

    expect(mealIdFromEvent).toBe(mealId.toValue())
  })
})
