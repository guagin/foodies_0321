import { ProviderEvent } from "./provider-event"

export class ChangeName extends ProviderEvent {
  constructor(public payload: { id: string; name: string }) {
    super(ChangeName.name)
  }
}
