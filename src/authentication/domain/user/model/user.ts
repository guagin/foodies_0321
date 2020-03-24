import { EntityId } from "entity-id"
import { Entity } from "entity"

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
  constructor(
    id: UserId,
    userPropsInput: UserPropsInput,
    private decryptor: (value: string) => string
  ) {
    super(id)
    this.props = new UserProps(userPropsInput)
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  isPasswordMatched(value: string): boolean {
    return this.props.password === this.decryptor(value)
  }
}
