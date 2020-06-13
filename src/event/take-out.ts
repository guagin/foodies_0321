import { DomainEvent } from "domain-event"

export class TakeOutCreated extends DomainEvent {
  constructor(
    public payload: {
      id: string
      createdBy: string
      title: string
      description: string
      startedAt: Date
      endAt: Date
    },
    applicationVersion: string
  ) {
    super(TakeOutCreated.name, applicationVersion)
  }
}
