import { UserViewRepository } from "../domain/user/model/user-respository"
import { UserView } from "../domain/user/model/user"

export class UserOfIdsUsaeCase {
  constructor(private userRepository: UserViewRepository) {}

  async ofIds(ids: string[]): Promise<UserView[]> {
    const result = await this.userRepository.ofIds(ids)

    return result.map(user => ({
      ...user,
      id: user.id
    }))
  }
}
