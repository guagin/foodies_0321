import { DomainEventPublisher } from "domain-event-publisher";
import { Meal } from "./meal";
import { MealPrepared } from "event/meal-prepared";

export class MealEventPublisher{
    private applicationVeriosn = process.env.applicationVeriosn || "0.0.0.0"
    constructor(private eventPublisher: DomainEventPublisher){
    }

    mealPrepared(meal: Meal, providerName: string): void{        
        const event = new MealPrepared({
            meal:{
                id: meal.id.toValue(),
                name: meal.name,
                price: meal.price,
                description: meal.description
            },
            provider:{
                name: providerName
            }
        },
        this.applicationVeriosn)
        this.eventPublisher.publish(event)
    }
}