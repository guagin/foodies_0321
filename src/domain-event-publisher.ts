import { DomainEvent } from "./domain-event"

export type DomainEventHandler = (event: DomainEvent) => void

export interface DomainEventPublisher {
  register(name: string, handler: DomainEventHandler): void
  publish(event: DomainEvent): void
}
