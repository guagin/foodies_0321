import { App } from "./app"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import mongoose from "mongoose"
import { UserView } from "./query/domain/user/model/user"
import faker from "faker"

describe("authentication app", () => {
  it("should pass", async () => {
    const mongoURL = process.env.mongo_url
    await mongoose.connect(mongoURL)

    const app = new App({
      crossContextEventPublisher: new SynchronizedDomainEventPublisher(),
      mongoConnection: mongoose.connection
    })

    const name = faker.name.firstName()
    const password = faker.random.words(16)
    const email = faker.random.words(16)
    const userId = await app.register(name, password, email)

    const promiseFetchUser = new Promise<UserView>(resolve => {
      setTimeout(() => {
        app
          .ofId(userId)
          .then(result => {
            resolve(result)
          })
          .catch(e => console.log(e))
      }, 2000)
    })

    const userView = await promiseFetchUser
    expect(userView.email).toEqual(email)
  })
})
