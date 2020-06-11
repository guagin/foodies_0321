import { EntityId } from "entity-id"
import { AggregateRoot } from "aggregate-root"
import { ProviderEvent } from "./event/provider-event"
import { ChangeName } from "./event/change-name"
import { ChangeDescrition } from "./event/change-description"
import { ChangePhone } from "./event/change-phone"

export class ProviderId extends EntityId {}

interface ProviderProps {
  createdBy: string
  name: string
  description: string
  phone: string
}

export class Provider extends AggregateRoot<ProviderEvent> {
  private props: ProviderProps

  constructor(
    id: ProviderId,
    props: {
      createdBy: string
      name: string
      description: string
      phone: string
    }
  ) {
    super(id)
    this.props = props
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get phone(): string {
    return this.props.phone
  }

  mutate(events: ProviderEvent[], version: number): void {
    this.assignEvents(events)
    this.assignVersion(version)
    events.forEach(e => {
      switch (e.name) {
        case ChangeDescrition.name:
          this.whenChangeDescription(
            (e as ChangeDescrition).payload.description
          )
          break
        case ChangeName.name:
          this.whenChangeName((e as ChangeName).payload.name)
          break
        case ChangePhone.name:
          this.whenChangePhone((e as ChangePhone).payload.phone)
          break
      }
    })
  }

  changeName(value: string): void {
    this.pushEvent(
      new ChangeName({
        id: this.id.toValue(),
        name: this.name
      })
    )
    this.whenChangeName(value)
  }

  private whenChangeName(value: string): void {
    this.props = {
      ...this.props,
      name: value
    }
  }

  changeDescription(value: string): void {
    this.pushEvent(new ChangeDescrition({ description: value }))
    this.whenChangeDescription(value)
  }

  private whenChangeDescription(value: string): void {
    this.props = {
      ...this.props,
      description: value
    }
  }

  changePhone(value: string): void {
    this.pushEvent(new ChangePhone({ phone: value }))
    this.whenChangePhone(value)
  }

  private whenChangePhone(value: string): void {
    this.props = {
      ...this.props,
      phone: value
    }
  }
}
