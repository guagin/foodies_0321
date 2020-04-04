import { DomainEvent } from "domain-event";

interface MealLaunchedPayload{
    meal: Meal
    provider: Provider
}

interface Meal{
    id: string
    name: string
    price: number
    description: string
}

interface Provider{
    name: string
}

export class MealLaunched extends DomainEvent{
    payload: MealLaunchedPayload
    constructor(payload: MealLaunchedPayload, applicationVersion: string){
        super("MealLaunched", applicationVersion)
        this.payload = payload
    }
}