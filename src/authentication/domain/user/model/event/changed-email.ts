import { UserEvent } from "./user-event"

export class ChangedEmail extends UserEvent {
  constructor(public email: string) {
    super("ChangedEmail")
  }
}
