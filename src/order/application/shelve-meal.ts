import { DomainEventPublisher } from "domain-event-publisher";
import { MealRepository } from "order/domain/meal/meal-repository";
import { MealId } from "order/domain/meal/meal";
import { MealEventPublisher } from "order/domain/meal/meal-event-publisher";
import { ShelveMealService } from "order/domain/meal/service/shelve-meal-service";

export class ShelveMeal{
    constructor(
        private mealrepository: MealRepository,
        private eventPublisher: DomainEventPublisher
    ){}

    async shelve(id: string): Promise<void>{
        const shelveMealService  = new ShelveMealService(
            this.mealrepository, 
            new MealEventPublisher(this.eventPublisher)
        )
        
        await shelveMealService.shelve(new MealId(id))
    }
}