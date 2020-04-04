import { DomainEvent } from "domain-event";

interface MealPreparedPayload{
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

export class MealPrepared extends DomainEvent{
    payload: MealPreparedPayload
    constructor(payload: MealPreparedPayload, applicationVersion: string){
        super("MealPrepared", applicationVersion)
        this.payload = payload
    }
}