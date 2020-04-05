import { InMemoryMealRepository } from "order/intrastructure/persistence/in-memory-meal-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { CreateMeal } from "./create-meal"
import { MealStatus } from "order/domain/meal/meal"

describe('create meal',()=>{
    it('should pass', async ()=>{
        const mealRepository = new InMemoryMealRepository()
        const eventPublisher = new SynchronizedDomainEventPublisher()

        const createMeal = new CreateMeal(mealRepository, eventPublisher)
        const mealId = await createMeal.create({
            name: 'RU_WEI',
            price: 100,
            description: 'good',
            pictures: [''],
            provider: 'uber'
        })
        
        const meal = await mealRepository.ofId(mealId)
        expect(meal).toBeDefined()
        expect(meal.status).toBe(MealStatus.preparing)
    })
})