import { DomainEvent } from "domain-event"

interface ProductProps {
    id: string
    amount: number
    note?: string
  }

interface ProductRemovedPayload{
    userId: string
    orderId: string
    products?: ProductProps[]
}

export class ProductRemoved extends DomainEvent{
    payload: ProductRemovedPayload
    constructor(payload: ProductRemovedPayload, applicationVersion: string){
        super("ProductRemoved", applicationVersion)
        this.payload = payload
    }
}