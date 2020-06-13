import { DomainEvent } from "domain-event"

export class UserLogined extends DomainEvent {
  constructor(
    public payload: {
      id: string
      name: string
    },
    applicationVersion: string
  ) {
    super(UserLogined.name, applicationVersion)
  }
}

export class UserRegistered extends DomainEvent {
  constructor(
    public payload: {
      userId: string
      name: string
      email: string
    },
    applicationVersion: string
  ) {
    super(UserRegistered.name, applicationVersion)
  }
}
