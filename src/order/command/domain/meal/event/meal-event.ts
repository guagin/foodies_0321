export class MealEvent {
  occurredAt: Date
  constructor(public name: string) {
    this.occurredAt = new Date()
  }
}
