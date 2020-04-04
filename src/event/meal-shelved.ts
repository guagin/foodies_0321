import { DomainEvent } from "domain-event";

interface MealShelvedPayload{
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

export class MealShelved extends DomainEvent{
    payload: MealShelvedPayload
    constructor(payload: MealShelvedPayload, applicationVersion: string){
        super("MealShelved", applicationVersion)
        this.payload = payload
    }
}