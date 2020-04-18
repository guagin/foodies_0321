import { UserRepository } from "../domain/user/model/user-respository"
import { UserOfIdService } from "../domain/user/service/user-of-id-service"
import { UserView } from "../domain/user/model/user"

export class UserOfIdUsaeCase {
  constructor(private userRepository: UserRepository) {}

  async ofId(id: string): Promise<UserView> {
    const userOfIdService = new UserOfIdService(this.userRepository)

    const result = await userOfIdService.ofId(id)

    return result
  }
}
