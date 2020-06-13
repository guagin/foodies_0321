import { ProviderEvent } from "./provider-event"

export class ChangeDescription extends ProviderEvent {
  constructor(public payload: { description: string }) {
    super(ChangeDescription.name)
  }
}
