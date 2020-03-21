import { RegisterService } from "./user-register-service"
import { User } from "../model/user"
import { InMemoryUserRepository } from "authentication/infrastructure/persistence/in-memory-user-repository"

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

const registerService = new RegisterService(userRepo)

describe("register service", () => {
  it("should pass", async () => {
    await registerService.register(user)

    const foundUser = await userRepo.ofId(userId)
    expect(foundUser.equals(user)).toBeTruthy()
  })
})
