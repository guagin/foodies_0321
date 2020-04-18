import { UserRegisterUsecase } from "./user-register"
import { InMemoryUserRepository } from "authentication/command/persistence/in-memory/user-repository"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"

describe("user register use case", () => {
  it("should pass", async () => {
    const userRepository = new InMemoryUserRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository,
      eventPublisher,
      decrypt: (value: string) => value,
      encrypt: (value: string) => value
    })
    const userId = await userRegisterUseCase.register({
      name: "ricky",
      password: "123456",
      email: "guagin0972@gmail.com"
    })

    const user = await userRepository.ofId(userId)

    expect(user).toBeDefined()
  })

  it("should fail for the empty name", async () => {
    const userRepository = new InMemoryUserRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository,
      eventPublisher,
      decrypt: (value: string) => value,
      encrypt: (value: string) => value
    })

    let error

    try {
      const userId = await userRegisterUseCase.register({
        name: "",
        password: "123456",
        email: "guagin0972@gmail.com"
      })

      const user = await userRepository.ofName("ricky")

      expect(user).toBeUndefined()
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
  })

  it("should fail for empty password", async () => {
    const userRepository = new InMemoryUserRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository,
      eventPublisher,
      decrypt: (value: string) => value,
      encrypt: (value: string) => value
    })

    let error

    try {
      const userId = await userRegisterUseCase.register({
        name: "ricky",
        password: "",
        email: "guagin0972@gmail.com"
      })

      const user = await userRepository.ofName("ricky")

      expect(user).toBeUndefined()
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
  })

  it("should fail for empty email", async () => {
    const userRepository = new InMemoryUserRepository()
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository,
      eventPublisher,
      decrypt: (value: string) => value,
      encrypt: (value: string) => value
    })
    let error
    try {
      const userId = await userRegisterUseCase.register({
        name: "ricky",
        password: "123456",
        email: ""
      })

      const user = await userRepository.ofName("ricky")

      expect(user).toBeUndefined()
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
  })
})
