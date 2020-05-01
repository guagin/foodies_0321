import mongoose from "mongoose"
import faker from "faker"
import { App } from "./app"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"

const oneHour = 1000 * 60 * 60
describe("order app, create order", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url)
    const app = new App({
      mongoConnection: mongoose.connection,
      crossContextEventPublisher: new SynchronizedDomainEventPublisher()
    })

    const takeOutId = await app.createTakeOut({
      createdBy: faker.random.uuid(),
      title: faker.random.words(10),
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneHour)
    })

    const orderId = await app.createOrder({
      createdBy: faker.random.uuid(),
      takeOutId
    })

    const order = await app.OrderOfId(orderId)

    expect(order).toBeDefined()
  })
})
