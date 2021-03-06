import { DomainEventPublisher } from "event/domain-event-publisher"
import { TakeOut } from "../order/command/domain/take-out/model/take-out"
import { TakeOutCreated } from "event/take-out"

export class TakeOutEventPublisher {
  private applicationVersion = process.env.applicationVersion || "0.0.0.0"
  constructor(private eventPublisher: DomainEventPublisher) {}

  takeOutCreated(takeOut: TakeOut): void {
    const event = new TakeOutCreated(
      {
        id: takeOut.id.toValue(),
        createdBy: takeOut.createdBy,
        title: takeOut.title,
        description: takeOut.description,
        startedAt: takeOut.startedAt,
        endAt: takeOut.endAt
      },
      this.applicationVersion
    )

    this.eventPublisher.publish(event)
  }
}
