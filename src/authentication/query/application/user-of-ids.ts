import { UserViewRepository } from "../domain/user/model/user-respository"
import { UserOfIdService } from "../domain/user/service/user-of-id-service"
import { UserView } from "../domain/user/model/user"

export class UserOfIdsUsaeCase {
  constructor(private userRepository: UserViewRepository) {}

  async ofId(ids: string[]): Promise<UserView[]> {
    const result = await this.userRepository.ofIds(ids)

    return result
  }
}
