import { EntityId } from "entity-id"

export abstract class Entity {
  id: EntityId
  protected createdAt: Date
  protected version: number

  constructor(id: EntityId) {
    this.id = id
    this.createdAt = new Date()
    this.version = 0
  }

  equals(anotherEntity: Entity): boolean {
    return this.isIdMatched(anotherEntity.id)
  }

  isIdMatched(id: EntityId): boolean {
    return this.id.equals(id)
  }
}
