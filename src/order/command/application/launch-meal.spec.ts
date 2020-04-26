import { InMemoryMealRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-meal-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { Meal, MealStatus } from "order/command/domain/meal/meal"
import { LaunchMeal } from "./launch-meal"

describe("launch meal", () => {
  it("should pass", async () => {
    const mealRepository = new InMemoryMealRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()

    const mealId = await mealRepository.nextId()
    const meal = new Meal(mealId, {
      name: "RU_WEI",
      price: 100,
      description: "",
      pictures: [""],
      status: MealStatus.preparing,
      provider: "uber"
    })

    await mealRepository.save(meal)

    const launchMeal = new LaunchMeal(mealRepository, eventPublisher)
    await launchMeal.launch(mealId.toValue())

    const launchedMeal = await mealRepository.ofId(mealId)
    expect(launchedMeal).toBeDefined()
    expect(launchedMeal.status).toBe(MealStatus.launched)
  })
})
