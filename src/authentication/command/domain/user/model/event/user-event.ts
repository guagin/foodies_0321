export class UserEvent {
  occurredAt: Date
  constructor(public name: string) {
    this.occurredAt = new Date()
  }
}
