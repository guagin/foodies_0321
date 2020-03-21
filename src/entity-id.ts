export class EntityId {
  protected id: string
  protected createdAt: Date
  constructor() {
    this.createdAt = new Date()
  }

  toValue(): string {
    return this.id
  }

  equals(anotherUserId: EntityId): boolean {
    return anotherUserId.toValue() === this.id
  }
}
