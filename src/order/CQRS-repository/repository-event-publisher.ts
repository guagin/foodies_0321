import { RepositoryEvent } from "./repository-event"
import debug from "debug"

export type RepositoryEventHandler<T extends RepositoryEvent> = (
  event: T
) => void

export interface RepositoryEventPublisher {
  register<T extends RepositoryEvent>(
    name: string,
    handler: RepositoryEventHandler<T>
  ): void
  publish<T extends RepositoryEvent>(event: T): void
}

export class LocalRepositoryEventPublisher implements RepositoryEventPublisher {
  private logger = debug("RepositoryEventPublisher")
  private eventHandlers: {
    [key: string]: RepositoryEventHandler<RepositoryEvent>[]
  }
  constructor() {
    this.eventHandlers = {}
  }
  register<T extends RepositoryEvent>(
    name: string,
    handler: RepositoryEventHandler<T>
  ): void {
    if (!this.eventHandlers[name]) {
      this.eventHandlers[name] = []
      this.logger(`init ${name} handlers array.`)
    }
    this.eventHandlers[name].push(handler)
    this.logger(`append new handlers to ${name}`)
  }

  publish(event: RepositoryEvent): void {
    if (!this.eventHandlers[event.constructor.name]) {
      return
    }

    const handlers = this.eventHandlers[event.constructor.name]
    handlers.forEach(handler => handler(event))
  }
}
