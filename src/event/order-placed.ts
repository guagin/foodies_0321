import { DomainEvent } from "domain-event"

interface ProductProps {
    id: string
    amount: number
    note?: string
  }

interface OrderPlacedPayload{
    userId: string
    orderId: string
    products?: ProductProps[]
}


export class OrderPlaced extends DomainEvent{
    payload: OrderPlacedPayload
    constructor(payload: OrderPlacedPayload, applicationVersion: string){
        super("OrderPlaced", applicationVersion)
        this.payload = payload
    }
}