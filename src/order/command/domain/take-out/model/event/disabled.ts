import { TakeOutEvent } from "./take-out-event"

export class Disabled extends TakeOutEvent {
  constructor() {
    super(Disabled.name)
  }
}
