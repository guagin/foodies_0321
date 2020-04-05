import { UserRepository } from "../user-repository"
import { User } from "../model/user"

export class UserLoginService {
  private userRepo: UserRepository
  private encrypt: (value: string) => string
  private generateToken: (user: User) => string
  constructor(input: {
    userRepo: UserRepository
    encrypt: (value: string) => string
    generateToken: (user: User) => string,
    
  }) {
    this.userRepo = input.userRepo
    this.encrypt = input.encrypt
    this.generateToken = input.generateToken
  }

  async login(
    name: string,
    password: string
  ): Promise<{ success: boolean; errorMessages?: string[]; token?: string }> {
    const user = await this.userRepo.ofName(name)

    if (!user) {
      return {
        success: false,
        errorMessages: ["user not found"]
      }
    }

    if (!user.isPasswordMatched(this.encrypt(password))) {
      return {
        success: false,
        errorMessages: ["password not matched"]
      }
    }

    return {
      success: true,
      token: this.generateToken(user)
    }
  }
}
