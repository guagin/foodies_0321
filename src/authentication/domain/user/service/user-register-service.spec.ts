import { RegisterService } from "./user-register-service"
import { User } from "../model/user"
import { InMemoryUserRepository } from "authentication/infrastructure/persistence/in-memory-user-repository"
import { SynchronizedDomainEventPublisher } from "authentication/infrastructure/event/synchronized-domain-event-publisher"

const userRepo = new InMemoryUserRepository()

const userId = userRepo.nextId()
// user

const user = new User(
  userId,
  {
    name: "ricky",
    password: "123456",
    email: "guagin0972@gmail.com"
  },
  (value: string) => value
)

const domainEventPublisher = new SynchronizedDomainEventPublisher()
const registerService = new RegisterService(userRepo, domainEventPublisher)

describe("user register service", () => {
  it("should pass", async () => {
    let isReceivedEvent = false
    domainEventPublisher.register("UserRegistered", () => {
      isReceivedEvent = true
    })
    await registerService.register(user)

    const foundUser = await userRepo.ofId(userId)
    expect(foundUser.equals(user)).toBeTruthy()
    expect(isReceivedEvent).toBeTruthy()
  })
})
