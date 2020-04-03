import { DomainEvent } from "./domain-event"

export type DomainEventHandler<T extends DomainEvent> = (event: T) => void

export interface DomainEventPublisher {
  register<T extends DomainEvent>(name: string, handler: DomainEventHandler<T>): void
  publish(event: DomainEvent): void
}
