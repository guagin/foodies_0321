import { UserLoginService } from "authentication/domain/user/service/user-login-service"
import { UserRepository } from "authentication/domain/user/user-repository"
import { User } from "authentication/domain/user/model/user"

export class UserLoginUseCase {
  private userRepository: UserRepository
  private generateToken: (user: User) => string
  private encrypt: (value: string) => string
  constructor(input: {
    userRepository: UserRepository
    generateToken: (user: User) => string
    encrypt: (value: string) => string
  }) {
    this.userRepository = input.userRepository
    this.generateToken = input.generateToken
    this.encrypt = input.encrypt
  }

  async login(input: {
    name: string
    password: string
  }): Promise<{ success: boolean; errorMessages?: string[]; token?: string }> {
    const userLoginService = new UserLoginService({
      userRepo: this.userRepository,
      generateToken: this.generateToken,
      encrypt: this.encrypt
    })
    return userLoginService.login(input.name, input.password)
  }
}
