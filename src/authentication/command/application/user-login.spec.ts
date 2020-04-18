import { InMemoryUserRepository } from "authentication/command/infrastructure/persistence/in-memory/user-repository"
import { UserLoginUseCase } from "./user-login"
import { UserLoginService } from "authentication/command/domain/user/service/user-login-service"
import jwt from "jsonwebtoken"
import { User } from "authentication/command/domain/user/model/user"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"

describe("user login use case", () => {
  const userRepository = new InMemoryUserRepository()
  // insert a user.

  const generateToken = (user: User) => {
    return jwt.sign(
      {
        id: user.id,
        name: user.name
      },
      "imRicky"
    )
  }
  const encrypt = (value: string) => value

  beforeAll(async () => {
    const userId = await userRepository.nextId()
    const user = new User(
      userId,
      {
        name: "ricky",
        password: "123456",
        email: "guagin0972@gmail.com"
      },
      (value: string) => value,
      (value: string) => value
    )

    await userRepository.save(user)
  })

  it("should pass", async () => {
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const userLoginUseCase = new UserLoginUseCase({
      encrypt,
      generateToken,
      userRepository,
      eventPublisher
    })

    const token = await userLoginUseCase.login({
      name: "ricky",
      password: "123456"
    })

    expect(token).toBeDefined()
  })

  it("should fail for password is empty", async () => {
    const eventPublisher = new SynchronizedDomainEventPublisher()
    const userLoginUseCase = new UserLoginUseCase({
      encrypt,
      generateToken,
      userRepository,
      eventPublisher
    })

    let error
    try {
      const token = await userLoginUseCase.login({
        name: "ricky",
        password: ""
      })
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
  })
})
