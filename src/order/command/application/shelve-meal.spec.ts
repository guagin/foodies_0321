import { InMemoryMealRepository } from "order/command/intrastructure/persistence/in-memory-meal-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Meal, MealStatus } from "order/command/domain/meal/meal"
import { ShelveMeal } from "./shelve-meal"

describe("shelve meal", () => {
  it("should pass", async () => {
    const mealRepository = new InMemoryMealRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()

    const mealId = await mealRepository.nextId()
    const meal = new Meal(mealId, {
      name: "RU_WEI",
      price: 100,
      description: "",
      pictures: [""],
      status: MealStatus.launched,
      provider: "uber"
    })

    await mealRepository.save(meal)

    const shelveMeal = new ShelveMeal(mealRepository, eventPublisher)
    await shelveMeal.shelve(mealId.toValue())

    const shelvedMeal = await mealRepository.ofId(mealId)
    expect(shelvedMeal).toBeDefined()
    expect(shelvedMeal.status).toBe(MealStatus.shelved)
  })
})
