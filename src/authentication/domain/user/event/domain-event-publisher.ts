import { DomainEvent } from "authentication/domain/user/event/domain-event"

export type DomainEventHandler = (event: DomainEvent) => void

export interface DomainEventPublisher {
  register(name: string, handler: DomainEventHandler): void
  publish(event: DomainEvent): void
}
