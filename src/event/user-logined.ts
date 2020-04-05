import { DomainEvent } from "domain-event";

interface UserLoginedPayload{
    id: string
    name: string
}

export class UserLogined extends DomainEvent{
    payload: UserLoginedPayload
    constructor(payload: UserLoginedPayload, applicationVersion: string){
        super("UserLogined", applicationVersion)
        this.payload = payload
    }
}
