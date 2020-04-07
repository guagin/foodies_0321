import { DomainEvent } from "domain-event"

interface TakeOutPayload{
    id: string
    createdBy: string
    title: string
    description: string
    startedAt: Date
    endAt: Date
}

export class TakeOutCreated extends DomainEvent{
    payload: TakeOutPayload
    constructor(payload: TakeOutPayload, applicationVersion: string){
        super("TakeOutCreated", applicationVersion)
        this.payload = payload
    }
}