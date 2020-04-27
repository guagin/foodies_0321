export class TakeOutEvent {
  occurredAt: Date

  constructor(public name: string) {
    this.occurredAt = new Date()
  }
}
