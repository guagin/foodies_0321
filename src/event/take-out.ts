import { DomainEvent } from "event/domain-event"

export class TakeOutCreated extends DomainEvent<{
  id: string
  createdBy: string
  title: string
  description: string
  startedAt: Date
  endAt: Date
}> {
  constructor(
    payload: {
      id: string
      createdBy: string
      title: string
      description: string
      startedAt: Date
      endAt: Date
    },
    applicationVersion: string
  ) {
    super(TakeOutCreated.name, applicationVersion, payload)
  }
}
