import { EntityId } from "entity-id"
import { Entity } from "entity"
import { AggregateRoot } from "aggregate-root"
import { TakeOutEvent } from "./event/take-out-event"
import { Disabled } from "./event/disabled"
import { Enabled } from "./event/enabled"

export class TakeOutId extends EntityId {}

interface TakeOutProps {
  createdBy: string
  title: string
  description: string
  startedAt: Date
  endAt: Date
  enabled: boolean
}

export class TakeOut extends AggregateRoot<TakeOutEvent> {
  private props: TakeOutProps
  constructor(id: TakeOutId, props: TakeOutProps) {
    super(id)
    this.props = props
  }

  get createdBy(): string {
    return this.props.createdBy
  }

  get title(): string {
    return this.props.title
  }

  get description(): string {
    return this.props.description
  }

  get startedAt(): Date {
    return this.props.startedAt
  }

  get endAt(): Date {
    return this.props.endAt
  }

  get enabled(): boolean {
    return this.props.enabled
  }

  mutate(events: TakeOutEvent[], version: number): void {
    this.assignEvents(events)
    this.assignVersion(version)

    this.events.forEach(event => {
      switch (event.name) {
        case Disabled.name:
          this.whenDisabled()
          break
        case Enabled.name:
          this.whenEnabled()
          break
        default:
          break
      }
    })
  }

  isAvailable(current: Date): boolean {
    return (
      this.props.enabled &&
      this.props.startedAt.getTime() <= current.getTime() &&
      current.getTime() < this.props.endAt.getTime()
    )
  }

  disable(): void {
    this.pushEvent(new Disabled())
    this.whenDisabled()
  }

  private whenDisabled(): void {
    this.props = {
      ...this.props,
      enabled: false
    }
  }

  enable(): void {
    this.pushEvent(new Enabled())
    this.whenEnabled()
  }

  private whenEnabled(): void {
    this.props = {
      ...this.props,
      enabled: false
    }
  }
}
