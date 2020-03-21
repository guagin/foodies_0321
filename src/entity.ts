import { EntityId } from "entity-id"

export abstract class Entity {
  protected id: EntityId
  protected createdAt: Date
  protected version: number
  constructor() {
    this.createdAt = new Date()
    this.version = 0
  }

  equals(anotherEntity: Entity): boolean {
    return this.id.equals(anotherEntity.id)
  }
}
