import { UserLoginService } from "authentication/domain/user/service/user-login-service"

export class UserLoginUseCase {
  private userLoginService: UserLoginService
  constructor(input: { userLoginService: UserLoginService }) {
    this.userLoginService = input.userLoginService
  }

  async login(input: {
    name: string
    password: string
  }): Promise<{ success: boolean; errorMessages?: string[]; token?: string }> {
    return this.userLoginService.login(input.name, input.password)
  }
}
