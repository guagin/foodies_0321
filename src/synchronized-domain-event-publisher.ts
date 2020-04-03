import debug from "debug"
import { DomainEvent } from "./domain-event"
import { DomainEventHandler } from "./domain-event-publisher"

// sync event handler, bad for performance.
export class SynchronizedDomainEventPublisher {
  private logger = debug("DomainHandler")
  private eventHandlers: {
    [key: string]: DomainEventHandler<DomainEvent>[]
  }
  constructor() {
    this.eventHandlers = {}
  }
  register<T extends DomainEvent>(name: string, handler: DomainEventHandler<T>): void {
    if (!this.eventHandlers[name]) {
      this.eventHandlers[name] = []
      this.logger(`init ${name} handlers array.`)
    }
    this.eventHandlers[name].push(handler)
    this.logger(`append new handlers to ${name}`)
  }

  publish(event: DomainEvent): void {
    if (!this.eventHandlers[event.name]) {
      return
    }

    const handlers = this.eventHandlers[event.name]
    handlers.forEach(handler => handler(event))
    this.eventHandlers[event.name] = []
  }
}
