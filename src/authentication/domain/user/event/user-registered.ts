import { UserId } from "../model/user"
import { DomainEvent } from "./domain-event"

interface UserRegisteredPayload {
  userId: UserId // turn this to string
  name: string
  email: string
}

export class UserRegistered extends DomainEvent {
  payload: UserRegisteredPayload
  constructor(payload: UserRegisteredPayload, applicationVersion: string) {
    super("UserRegistered", applicationVersion)
    this.payload = payload
  }
}
