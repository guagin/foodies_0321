import { InMemoryUserRepository } from "authentication/infrastructure/persistence/in-memory-user-repository"
import { UserLoginUseCase } from "./user-login"
import { UserLoginService } from "authentication/domain/user/service/user-login-service"
import jwt from "jsonwebtoken"
import { User } from "authentication/domain/user/model/user"

describe("user login use case", () => {
  const userRepository = new InMemoryUserRepository()
  // insert a user.
  const userId = userRepository.nextId()

  const userLoginService = new UserLoginService({
    userRepo: userRepository,
    encrypt: (value: string) => value,
    generateToken: (user: User) => {
      return jwt.sign(
        {
          id: user.id,
          name: user.name
        },
        "imRicky"
      )
    }
  })

  beforeAll(async () => {
    const user = new User(
      userId,
      {
        name: "ricky",
        password: "123456",
        email: "guagin0972@gmail.com"
      },
      (value: string) => value
    )

    await userRepository.save(user)
  })
  it("should pass", async () => {
    const userLoginUseCase = new UserLoginUseCase({
      userLoginService
    })

    const { success, errorMessages, token } = await userLoginUseCase.login({
      name: "ricky",
      password: "123456"
    })

    expect(success).toBeTruthy()
    expect(errorMessages).toBeUndefined()
    expect(token).toBeDefined()
  })

  it("should fail for password is empty", async () => {
    const userLoginUseCase = new UserLoginUseCase({
      userLoginService
    })

    const { success, errorMessages, token } = await userLoginUseCase.login({
      name: "ricky",
      password: ""
    })

    expect(success).toBeFalsy()
    expect(errorMessages).toBeDefined()
    expect(token).toBeUndefined()
  })
})
