import { UserEvent } from "./user-event";

export class ChangedEmail implements UserEvent{
    constructor(public email: string){}

    name(): string{
        return "ChangedEmail"
    }
}