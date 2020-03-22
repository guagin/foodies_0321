import { InMemoryUserRepository } from "authentication/infrastructure/persistence/in-memory-user-repository"
import { User } from "../model/user"
import { UserLoginService } from "./user-login-service"

describe("user login service", () => {
  const userRepository = new InMemoryUserRepository()
  // insert a user.
  const userId = userRepository.nextId()

  const userLoginService = new UserLoginService(userRepository)

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
    const { success, errorMessages } = await userLoginService.login(
      "ricky",
      "123456"
    )
    expect(success).toBeTruthy()
    expect(errorMessages).toBeUndefined()
  })

  it("should failed for the password not matched", async () => {
    const { success, errorMessages } = await userLoginService.login("ricky", "")
    expect(success).toBeFalsy()
    expect(errorMessages).toBeDefined()
  })

  it("should failed for user not found", async () => {
    const { success, errorMessages } = await userLoginService.login(
      "ricky123",
      "123456"
    )
    expect(success).toBeFalsy()
    expect(errorMessages).toBeDefined()
  })
})
