import { UserViewRepository } from "../model/user-respository"
import { UserView } from "../model/user"
import { UserNotFound } from "./error/user-not-found"

export class UserofNameService {
  constructor(private userRepository: UserViewRepository) {}

  async ofName(name: string): Promise<UserView> {
    const user = await this.userRepository.ofName(name)
    if (!user) {
      throw new UserNotFound(`name :${name}`)
    }

    return user
  }
}
