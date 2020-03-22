import { EntityId } from "entity-id"

export abstract class Entity<PropsType> {
  id: EntityId
  protected createdAt: Date
  protected version: number
  protected props: PropsType
  constructor(id: EntityId, props: PropsType) {
    this.id = id
    this.createdAt = new Date()
    this.version = 0
    this.props = props
  }

  equals(anotherEntity: Entity<PropsType>): boolean {
    return this.isIdMatched(anotherEntity.id)
  }

  isIdMatched(id: EntityId): boolean {
    return this.id.equals(id)
  }
}
