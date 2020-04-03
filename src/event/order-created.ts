import { DomainEvent } from "domain-event"

interface ProductProps {
    id: string
    amount: number
    note?: string
  }

interface OrderCreatedPayload{
    userId: string
    orderId: string
    products?: ProductProps[]
}

export class OrderCreated extends DomainEvent{
    payload: OrderCreatedPayload
    constructor(payload: OrderCreatedPayload, applicationVersion: string){
        super("OrderCreated", applicationVersion)
        this.payload = payload
    }
}