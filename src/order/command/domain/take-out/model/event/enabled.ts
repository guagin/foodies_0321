import { TakeOutEvent } from "./take-out-event"

export class Enabled extends TakeOutEvent {
  constructor() {
    super(Enabled.name)
  }
}
