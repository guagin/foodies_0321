import { DomainEvent } from "domain-event"

interface ProductProps {
    id: string
    amount: number
    note?: string
  }

interface ProductAppendedPayload{
    userId: string
    orderId: string
    products?: ProductProps[]
}

export class ProductAppended extends DomainEvent{
    payload: ProductAppendedPayload
    constructor(payload: ProductAppendedPayload, applicationVersion: string){
        super("ProductAppended", applicationVersion)
        this.payload = payload
    }
}