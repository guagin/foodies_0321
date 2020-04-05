import { DomainEvent } from "domain-event"

interface UserRegisteredPayload {
  userId: string
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
