import { DomainEvent } from "domain-event";

interface OrderAppendedPayload{
    userId: string
    orderId: string
    takeOutId: string
}

export class OrderAppended extends DomainEvent{
    payload: OrderAppendedPayload
    constructor(payload: OrderAppendedPayload, applicationVersion: string){
        super("OrderAppended", applicationVersion)
        this.payload = payload
    }
}