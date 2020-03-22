import debug from "debug"
import { DomainEvent } from "authentication/domain/user/event/domain-event"
import { DomainEventHandler } from "authentication/domain/user/event/domain-event-publisher"

// sync event handler, bad for performance.
export class SynchronizedDomainEventPublisher {
  private logger = debug("DomainHandler")
  private eventHandlers: {
    [key: string]: DomainEventHandler[]
  }
  constructor() {
    this.eventHandlers = {}
  }
  register(name: string, handler: DomainEventHandler): void {
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
