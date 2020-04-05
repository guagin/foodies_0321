import { InMemoryMealRepository } from "order/intrastructure/persistence/in-memory-meal-repository";
import { MealId } from "order/domain/meal/meal";
import { CreateMealService } from "order/domain/meal/service/create-meal-service";
import { MealEventPublisher } from "order/domain/meal/meal-event-publisher";
import { DomainEventPublisher } from "domain-event-publisher";

export class CreateMeal {
    constructor(
        private mealRepository: InMemoryMealRepository,
        private eventPublisher: DomainEventPublisher
    ){}

    async create(input:{
        name: string,
        price: number,
        description: string,
        pictures: string[],
        provider: string
    }): Promise<MealId>{
        const createMealService = new CreateMealService({
            mealRepository: this.mealRepository,
            mealEventPublisher: new MealEventPublisher(this.eventPublisher)
        })

        const mealId = await createMealService.create({...input})
        return mealId
    }
}