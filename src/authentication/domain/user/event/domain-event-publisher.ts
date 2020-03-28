import { DomainEvent } from "authentication/domain/user/event/domain-event"

export type DomainEventHandler<DomainType extends DomainEvent> = (
  event: DomainType
) => void

export interface DomainEventPublisher {
  register<DomainType extends DomainEvent>(
    name: string,
    handler: DomainEventHandler<DomainType>
  ): void
  publish(event: DomainEvent): void
}
