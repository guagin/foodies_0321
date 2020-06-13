import { RepositoryEvent } from "../repository-event"
import { Provider } from "order/command/domain/provider/model/provider"

export class Saved extends RepositoryEvent {
  constructor(public provider: Provider) {
    super()
  }
}
