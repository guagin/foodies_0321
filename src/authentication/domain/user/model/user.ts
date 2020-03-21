import { EntityId } from "entity-id"
import { Entity } from "entity"

export class UserId extends EntityId {}

export class UserProps {
  name: string
  password: string
  email: string
}

export class User extends Entity {
  protected props: UserProps

  constructor(props: UserProps, private decreptor: (value: string) => string) {
    super()
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  isPasswordMatched(value: string): boolean {
    return this.props.password === this.decreptor(value)
  }
}
