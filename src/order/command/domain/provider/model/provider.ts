import { EntityId } from "entity-id"
import { AggregateRoot } from "aggregate-root"

export class ProviderId extends EntityId {}

interface ProviderProps {
  createdBy: string
  name: string
  description: string
  phone: string
}

export class Provider extends AggregateRoot<ProviderEvent> {}
