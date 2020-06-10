import { ProviderEvent } from "./provider-event"

export class ChangePhone extends ProviderEvent {
  constructor(public payload: { phone: string }) {
    super(ChangePhone.name)
  }
}
