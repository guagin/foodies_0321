import { RegisterService } from "./user-register-service"
import { InMemoryUserRepository } from "authentication/command/infrastructure/persistence/in-memory/user-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { UserEventPublisher } from "../event/user-event-publisher"
import { UserRegistered } from "event/user-registered"

describe("user register service", () => {
  it("should pass", async () => {
    const userRepository = new InMemoryUserRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()

    const eventPromise = new Promise<string>(resolve => {
      eventPublisher.register<UserRegistered>("UserRegistered", e => {
        resolve(e.payload.userId)
      })
    })

    const registerService = new RegisterService({
      userRepository,
      userEventPublisher: new UserEventPublisher(eventPublisher),
      decrypt: (value: string) => value,
      encrypt: (value: string) => value,
      localizeErrorMsg: (value: string) => {
        return ""
      }
    })

    const userId = await registerService.register({
      name: "ricky",
      password: "123456",
      email: "guagin0972@gmail.com"
    })

    expect(userId).toBeDefined()
    expect(await eventPromise).toBe(userId.toValue())
  })
})
