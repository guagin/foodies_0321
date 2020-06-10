import { ProviderEvent } from "./provider-event"

export class ChangeDescrition extends ProviderEvent {
  constructor(public payload: { description: string }) {
    super(ChangeDescrition.name)
  }
}
