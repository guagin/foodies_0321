import { UserRepository } from "authentication/domain/user/user-repository"
import { User } from "authentication/domain/user/model/user"

export class UserRegisterUsecase {
  private userRepository: UserRepository
  private decryptor: (value: string) => string
  constructor(input: {
    userRepository: UserRepository
    decryptor: (value: string) => string
  }) {
    this.userRepository = input.userRepository
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
        this.decryptor
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
