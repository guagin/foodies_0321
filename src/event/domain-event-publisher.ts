import { DomainEvent } from "./domain-event"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DomainEventHandler<T extends DomainEvent<any>> = (event: T) => void

export interface DomainEventPublisher {
  register<Payload>(
    name: string,
    handler: DomainEventHandler<DomainEvent<Payload>>
  ): void
  publish<Payload>(event: DomainEvent<Payload>): void
}
