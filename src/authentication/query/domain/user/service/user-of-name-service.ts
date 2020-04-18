import { UserViewRepository } from "../model/user-respository"
import { UserView } from "../model/user"
import { UserNotFound } from "./error/user-not-found"

export class UserofNameService {
  constructor(private userRepository: UserViewRepository) {}

  async ofName(id: string): Promise<UserView> {
    const user = await this.userRepository.ofName(id)
    if (!user) {
      throw new UserNotFound(`id :${id}`)
    }

    return user
  }
}
