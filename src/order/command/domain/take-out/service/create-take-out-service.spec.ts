import { InMemoryTakeOutRepository } from "order/command/intrastructure/persistence/in-memory/in-memory-take-out-repository"
import { CreateTakeOutService } from "./create-take-out-service"
import { TakeOutEventPublisher } from "../../../../../event/take-out-event-publisher"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { TakeOutCreated } from "event/take-out"

const oneDay = 60 * 60 * 24 * 1000

describe("create take out service", () => {
  it("should pass", async () => {
    const takeOutRepository = new InMemoryTakeOutRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const eventPromise = new Promise<string>(resolve => {
      eventPublisher.register<TakeOutCreated>("TakeOutCreated", e => {
        resolve(e.payload.id)
      })
    })

    const takeOutEventPublisher = new TakeOutEventPublisher(eventPublisher)

    const createTakeOutService = new CreateTakeOutService(
      takeOutRepository,
      takeOutEventPublisher
    )

    const id = await createTakeOutService.create({
      createdBy: "ricky",
      title: "lunch",
      description: "",
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneDay),
      providerId: "12345"
    })

    expect(id).toBeDefined()
    expect(await eventPromise).toBe(id.toValue())
  })
})
