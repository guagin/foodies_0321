import { RepositoryEvent } from "./repository-event"
import { User } from "authentication/command/domain/user/model/user"

export class Saved extends RepositoryEvent {
  constructor(public user: User) {
    super()
  }
}
