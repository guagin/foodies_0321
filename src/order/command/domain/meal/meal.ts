import { EntityId } from "entity-id"
import { MealIsNotPreparing } from "./error/meal-is-not-preparing"
import { MealIsNotLaunched } from "./error/meal-is-not-launched"
import { MealIsNotShelved } from "./error/meal-is-not-shelved"
import { AggregateRoot } from "aggregate-root"
import { MealEvent } from "./event/meal-event"
import { Launched } from "./event/launched"
import { TurnedToPreparing } from "./event/turned-to-preparing"
import { Shelved } from "./event/shelved"

export class MealId extends EntityId {}

export enum MealStatus {
  preparing,
  launched,
  shelved
}

interface MealProps {
  name: string
  price: number
  description: string
  pictures: string[]
  status: MealStatus
  provider: string
}

export class Meal extends AggregateRoot<MealEvent> {
  private props: MealProps
  constructor(id: MealId, props: MealProps) {
    super(id)
    this.props = props
  }

  get name(): string {
    return this.props.name
  }

  get pictures(): string[] {
    return this.props.pictures
  }

  get price(): number {
    return this.props.price
  }

  get description(): string {
    return this.props.description
  }

  get provider(): string {
    return this.props.provider
  }

  get status(): MealStatus {
    return this.props.status
  }

  mutate(events: MealEvent[], version: number): void {
    this.assignEvents(events)
    this.assignVersion(version)

    events.forEach(event => {
      switch (event.name) {
        case Launched.name:
          this.whenLaunched()
          break
        case TurnedToPreparing.name:
          this.whenPrepared()
          break
        case Shelved.name:
          this.whenShelved()
          break
        default:
          break
      }
    })
  }

  launch(): void {
    this.pushEvent(new Launched())
    this.whenLaunched()
  }

  private whenLaunched(): void {
    if (this.props.status === MealStatus.launched) {
      return
    }
    if (this.props.status !== MealStatus.preparing) {
      throw new MealIsNotPreparing()
    }
    this.props.status = MealStatus.launched
  }

  shelve(): void {
    this.pushEvent(new Shelved())
    this.whenShelved()
  }

  private whenShelved(): void {
    if (this.props.status === MealStatus.shelved) {
      return
    }
    if (this.props.status !== MealStatus.launched) {
      throw new MealIsNotLaunched()
    }
    this.props.status = MealStatus.shelved
  }

  prepare(): void {
    this.pushEvent(new TurnedToPreparing())
    this.whenPrepared()
  }

  private whenPrepared(): void {
    if (this.props.status === MealStatus.preparing) {
      return
    }
    if (this.props.status !== MealStatus.shelved) {
      throw new MealIsNotShelved()
    }
    this.props.status = MealStatus.preparing
  }
}
