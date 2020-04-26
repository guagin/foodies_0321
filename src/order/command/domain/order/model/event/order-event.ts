export class OrderEvent {
  occurredAt: Date
  constructor(public name: string) {
    this.occurredAt = new Date()
  }
}
