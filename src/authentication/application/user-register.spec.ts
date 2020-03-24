import { UserRegisterUsecase } from "./user-register"
import { InMemoryUserRepository } from "authentication/infrastructure/persistence/in-memory-user-repository"

describe("user register test", () => {
  it("should pass", async () => {
    const userRepository = new InMemoryUserRepository()
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository,
      decryptor: (value: string) => value
    })
    const { success, errorMessage } = await userRegisterUseCase.register({
      name: "ricky",
      password: "123456",
      email: "guagin0972@gmail.com"
    })

    const user = userRepository.ofName("ricky")

    expect(user).toBeDefined()
    expect(success).toBeTruthy()
    expect(errorMessage).toBeUndefined()
  })

  it("should fail for the empty name", async () => {
    const userRepository = new InMemoryUserRepository()
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository,
      decryptor: (value: string) => value
    })
    const { success, errorMessage } = await userRegisterUseCase.register({
      name: "",
      password: "123456",
      email: "guagin0972@gmail.com"
    })

    const user = await userRepository.ofName("ricky")

    expect(user).toBeUndefined()
    expect(success).toBeFalsy()
    expect(errorMessage).toBeDefined()
  })

  it("should fail for empty password", async () => {
    const userRepository = new InMemoryUserRepository()
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository,
      decryptor: (value: string) => value
    })

    const { success, errorMessage } = await userRegisterUseCase.register({
      name: "ricky",
      password: "",
      email: "guagin0972@gmail.com"
    })

    const user = await userRepository.ofName("ricky")

    expect(user).toBeUndefined()
    expect(success).toBeFalsy()
    expect(errorMessage).toBeDefined()
  })

  it("should fail for empty email", async () => {
    const userRepository = new InMemoryUserRepository()
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository,
      decryptor: (value: string) => value
    })
    const { success, errorMessage } = await userRegisterUseCase.register({
      name: "ricky",
      password: "123456",
      email: ""
    })

    const user = await userRepository.ofName("ricky")

    expect(user).toBeUndefined()
    expect(success).toBeFalsy()
    expect(errorMessage).toBeDefined()
  })
})
