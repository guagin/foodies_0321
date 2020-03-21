export class EntityId {
  protected id: string
  protected createdAt: Date
  constructor(id: string) {
    this.id = id
    this.createdAt = new Date()
  }

  toValue(): string {
    return this.id
  }

  equals(anotherUserId: EntityId): boolean {
    return anotherUserId.toValue() === this.id
  }
}
