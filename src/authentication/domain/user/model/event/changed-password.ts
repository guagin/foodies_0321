import { UserEvent } from "./user-event"

export class ChangedPassword extends UserEvent {
  constructor(public password: string) {
    super("ChangedPassword")
  }
}
