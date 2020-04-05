import { DomainEventPublisher } from "domain-event-publisher";
import { MealRepository } from "order/domain/meal/meal-repository";
import { MealId } from "order/domain/meal/meal";
import { MealEventPublisher } from "order/domain/meal/meal-event-publisher";
import { PrepareMealService } from "order/domain/meal/service/prepare-meal-service";

export class PrepareMeal{
    constructor(
        private mealrepository: MealRepository,
        private eventPublisher: DomainEventPublisher
    ){}

    async prepare(id: string): Promise<void>{
        const prepareMealService  = new PrepareMealService(
            this.mealrepository, 
            new MealEventPublisher(this.eventPublisher)
        )
        
        await prepareMealService.prepare(new MealId(id))
    }
}