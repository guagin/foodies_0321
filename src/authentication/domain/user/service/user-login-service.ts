import { UserRepository } from "../user-repository"

export class UserLoginService {
  constructor(private userRepo: UserRepository) {}

  async login(
    name: string,
    password: string
  ): Promise<{ success: boolean; errorMessages?: string[] }> {
    const user = await this.userRepo.ofName(name)

    if (!user) {
      return {
        success: false,
        errorMessages: ["user not found"]
      }
    }

    if (!user.isPasswordMatched(password)) {
      return {
        success: false,
        errorMessages: ["password not matched"]
      }
    }
    return {
      success: true
    }
  }
}
