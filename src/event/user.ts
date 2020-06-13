import { DomainEvent } from "event/domain-event"

export class UserLogined extends DomainEvent<{
  id: string
  name: string
}> {
  constructor(
    payload: {
      id: string
      name: string
    },
    applicationVersion: string
  ) {
    super(UserLogined.name, applicationVersion, payload)
  }
}

export class UserRegistered extends DomainEvent<{
  userId: string
  name: string
  email: string
}> {
  constructor(
    payload: {
      userId: string
      name: string
      email: string
    },
    applicationVersion: string
  ) {
    super(UserRegistered.name, applicationVersion, payload)
  }
}
