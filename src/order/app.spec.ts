import mongoose from "mongoose"
import faker from "faker"
import { App } from "./app"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"

let app: App

const oneHour = 1000 * 60 * 60
describe("order app, create take out", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.mongo_url)
    app = new App({
      mongoConnection: mongoose.connection,
      crossContextEventPublisher: new SynchronizedDomainEventPublisher()
    })
  })
  it("should pass", async () => {
    const takeOutId = await app.createTakeOut({
      createdBy: faker.random.uuid(),
      title: faker.random.words(10),
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneHour)
    })

    // TODO: should wait untile the takeout created.
    const wait1SecondsPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    await wait1SecondsPromise

    expect(takeOutId).toBeDefined()

    const takeOut = await app.takeOutOfId(takeOutId)
  })
})
describe("order app, create order", () => {
  it("should pass", async () => {
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
