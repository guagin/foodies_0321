import { UserViewRepository } from "../domain/user/model/user-respository"
import { UserView } from "../domain/user/model/user"
import { UserofNameService } from "../domain/user/service/user-of-name-service"

export class UserOfNameUsaeCase {
  constructor(private userRepository: UserViewRepository) {}

  async ofName(name: string): Promise<UserView> {
    const userOfIdService = new UserofNameService(this.userRepository)

    const result = await userOfIdService.ofName(name)

    return result
  }
}
