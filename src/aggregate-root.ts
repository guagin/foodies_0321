import { Entity } from "entity"
import { EntityId } from "entity-id"

interface AggregateProps<EventType> {
  events: EventType[]
  version: number
}

export abstract class AggregateRoot<EventType> extends Entity {
  protected aggregateProps: AggregateProps<EventType>
  constructor(id: EntityId) {
    super(id)
    this.aggregateProps = {
      events: [],
      version: 0
    }
  }

  protected assignEvents(events: EventType[]) {
    this.aggregateProps.events = events
  }

  protected pushEvent(event: EventType) {
    this.aggregateProps.events.push(event)
  }

  abstract mutate(events: EventType[], version: number): void

  get events(): EventType[] {
    return this.aggregateProps.events
  }

  protected assignVersion(version: number): void {
    this.aggregateProps.version = version
  }

  get version(): number {
    return this.aggregateProps.version
  }
}
