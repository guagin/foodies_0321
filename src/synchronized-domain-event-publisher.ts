import debug from "debug"
import { DomainEvent } from "./event/domain-event"
import {
  DomainEventHandler,
  DomainEventPublisher
} from "./event/domain-event-publisher"

// sync event handler, bad for performance.
export class SynchronizedDomainEventPublisher implements DomainEventPublisher {
  private logger = debug("DomainHandler")
  private eventHandlers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: DomainEventHandler<DomainEvent<any>>[]
  }
  constructor() {
    this.eventHandlers = {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register<T extends DomainEvent<any>>(
    name: string,
    handler: DomainEventHandler<T>
  ): void {
    if (!this.eventHandlers[name]) {
      this.eventHandlers[name] = []
      this.logger(`init ${name} handlers array.`)
    }
    this.eventHandlers[name].push(handler)
    this.logger(`append new handlers to ${name}`)
  }

  publish(event: DomainEvent<any>): void {
    if (!this.eventHandlers[event.name]) {
      return
    }

    const handlers = this.eventHandlers[event.name]
    handlers.forEach(handler => handler(event))
    this.eventHandlers[event.name] = []
  }
}
