import { DomainEventPublisher } from "domain-event-publisher";
import { MealRepository } from "order/domain/meal/meal-repository";
import { MealId } from "order/domain/meal/meal";
import { LaunchMealService } from "order/domain/meal/service/launch-meal-service";
import { MealEventPublisher } from "order/domain/meal/meal-event-publisher";

export class LaunchMeal{
    constructor(
        private mealrepository: MealRepository,
        private eventPublisher: DomainEventPublisher
    ){}

    async launch(id: string): Promise<void>{
        const launchMealService  = new LaunchMealService(
            this.mealrepository, 
            new MealEventPublisher(this.eventPublisher)
        )
        
        await launchMealService.launch(new MealId(id))
    }
}