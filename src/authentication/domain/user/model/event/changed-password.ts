import { UserEvent } from "./user-event";

export class ChangedPassword implements UserEvent{
    constructor(public password: string){}

    name(): string{
        return "ChangedPassword"
    }
}