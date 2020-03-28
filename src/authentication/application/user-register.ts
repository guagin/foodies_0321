import { UserRepository } from "authentication/domain/user/user-repository"
import { User } from "authentication/domain/user/model/user"

export class UserRegisterUsecase {
  private userRepository: UserRepository
  private decrypt: (value: string) => string
  private encrypt: (value: string) => string

  constructor(input: {
    userRepository: UserRepository
    decrypt: (value: string) => string
    encrypt: (value: string) => string
  }) {
    this.userRepository = input.userRepository
    this.decrypt = input.decrypt
    this.encrypt = input.encrypt
  }

  async register(input: {
    name: string
    password: string
    email: string
  }): Promise<{ success: boolean; errorMessage?: string }> {
    const userId = this.userRepository.nextId()
    try {
      const user = new User(
        userId,
        {
          name: input.name,
          password: input.password,
          email: input.email
        },
        this.decrypt,
        this.encrypt
      )

      await this.userRepository.save(user)
      return {
        success: true
      }
    } catch (e) {
      return {
        success: false,
        errorMessage: e.message
      }
    }
  }
}
