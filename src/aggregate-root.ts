import { Entity } from "entity"
import { EntityId } from "entity-id"

interface AggregateProps<EventType> {
  events: EventType[]
}

export abstract class AggregateRoot<EventType> extends Entity {
  protected aggregateProps: AggregateProps<EventType>
  constructor(id: EntityId) {
    super(id)
    this.aggregateProps = {
      events: []
    }
  }

  protected assignEvents(events: EventType[]) {
    this.aggregateProps.events = events
  }

  protected pushEvent(event: EventType) {
    this.aggregateProps.events.push(event)
  }

  abstract mutate(events: EventType[], version: number): void
}
