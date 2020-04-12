import { EntityId } from "entity-id"
import { Entity } from "entity"
import { UserEvent } from "./event/user-event"
import { ChangedEmail } from "./event/changed-email"
import { ChangedPassword } from "./event/changed-password"

export class UserId extends EntityId {}

class UserProps {
  name: string
  password: string
  email: string

  constructor(props: UserPropsInput) {
    this.setName(props.name)
    this.setEmail(props.email)
    this.setPassword(props.password)
  }

  setName(value: string) {
    if (!value) {
      throw Error("name is not valid")
    }
    this.name = value
  }

  setEmail(value: string) {
    if (!value) {
      throw Error("email is not valid")
    }
    this.email = value
  }

  setPassword(value: string) {
    if (!value) {
      throw new Error("password is not valid")
    }

    this.password = value
  }
}

interface UserPropsInput {
  name: string
  password: string
  email: string
}

export class User extends Entity {
  private props: UserProps
  private events: UserEvent[]

  constructor(
    id: UserId,
    userPropsInput: UserPropsInput,
    private decryptor: (value: string) => string,
    private encrypt: (value: string) => string
  ) {
    super(id)
    this.events = []
    const { password, ...rest } = userPropsInput
    this.props = new UserProps({
      password: encrypt(password),
      ...rest
    })
  }

  mutate(events: UserEvent[]): void {
    this.events = events
    events.forEach(e => {
      switch (e.name) {
        case ChangedEmail.name:
          this.whenChangedEmail((e as ChangedEmail).email)
          break
        case ChangedPassword.name:
          this.whenChangedPassword((e as ChangedPassword).password)
          break
        default:
          break
      }
    })
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  get eventStream(): UserEvent[] {
    return [...this.events]
  }

  isPasswordMatched(value: string): boolean {
    return this.props.password === this.decryptor(value)
  }

  changeEmail(value: string) {
    const event = new ChangedEmail(value)
    this.events.push(event)
    this.whenChangedEmail(value)
  }

  whenChangedEmail(email: string) {
    this.props = new UserProps({
      ...this.props,
      email
    })
  }

  changePassword(value: string) {
    const event = new ChangedPassword(value)
    this.events.push(event)
    this.whenChangedPassword(value)
  }

  whenChangedPassword(password: string) {
    this.props = new UserProps({
      ...this.props,
      password
    })
  }
}
