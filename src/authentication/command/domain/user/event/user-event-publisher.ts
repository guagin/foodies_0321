import { DomainEventPublisher } from "domain-event-publisher"
import { UserRegistered, UserLogined } from "event/user"

export class UserEventPublisher {
  private applicationVeriosn = process.env.applicationVeriosn || "0.0.0.0"
  constructor(private eventPublisher: DomainEventPublisher) {}

  userRegistered(input: { userId: string; name: string; email: string }): void {
    const event = new UserRegistered({ ...input }, this.applicationVeriosn)
    this.eventPublisher.publish(event)
  }

  userLogined(input: { id: string; name: string }): void {
    const event = new UserLogined({ ...input }, this.applicationVeriosn)
    this.eventPublisher.publish(event)
  }
}
