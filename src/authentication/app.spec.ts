import { App } from "./app"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import mongoose from "mongoose"
import { UserView } from "./query/domain/user/model/user"

describe("authentication app", () => {
  it("should pass", async () => {
    const mongoURL = process.env.mongo_url
    await mongoose.connect(mongoURL)

    const app = new App({
      crossContextEventPublisher: new SynchronizedDomainEventPublisher(),
      connection: mongoose.connection
    })

    const userId = await app.register("ricky", "12345", "11121")

    const promiseFetchUser = new Promise<UserView>(resolve => {
      setTimeout(() => {
        app
          .ofId(userId)
          .then(result => {
            resolve(result)
          })
          .then(e => console.log(e))
      }, 2000)
    })

    const userView = await promiseFetchUser
    expect(userView.email).toBe("11121")
  })
})
