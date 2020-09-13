import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-take-out-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"

import { CreateTakeOut } from "./create-take-out"
import { TakeOutCreated } from "event/take-out"

const oneDay = 60 * 60 * 24 * 1000

describe("create take out", () => {
  it("should pass", async () => {
    const takeOutRepository = new InMemoryTakeOutRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()

    const eventPromise = new Promise<string>(resolve => {
      eventPublisher.register<TakeOutCreated>("TakeOutCreated", e => {
        resolve(e.payload.id)
      })
    })

    const createTakeOut = new CreateTakeOut(takeOutRepository, eventPublisher)
    const id = await createTakeOut.create({
      createdBy: "ricky",
      title: "lunch",
      description: "",
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneDay)
    })

    expect(await eventPromise).toBe(id.toValue())
  })
})
