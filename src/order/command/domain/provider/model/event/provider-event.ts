export class ProviderEvent {
  occurredAt: Date
  constructor(public name: string) {
    this.occurredAt = new Date()
  }
}
