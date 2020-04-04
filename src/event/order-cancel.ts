import { DomainEvent } from "domain-event"

interface ProductProps {
    id: string
    amount: number
    note?: string
  }

interface OrderCancelPayload{
    userId: string
    orderId: string
    products?: ProductProps[]
}

export class OrderCanceled extends DomainEvent{
    payload: OrderCancelPayload
    constructor(payload: OrderCancelPayload, applicationVersion: string){
        super("OrderCanceled", applicationVersion)
        this.payload = payload
    }
}