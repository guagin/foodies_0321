import { UserViewRepository } from "../model/user-respository"
import { UserView } from "../model/user"
import { UserNotFound } from "./error/user-not-found"

export class UserOfIdService {
  constructor(private userRepository: UserViewRepository) {}

  async ofId(id: string): Promise<UserView> {
    const user = await this.userRepository.ofId(id)
    if (!user) {
      throw new UserNotFound(`id :${id}`)
    }

    return user
  }
}
