import { UserRepository } from "../user-repository"
import { User } from "../model/user"

export class RegisterService {
  constructor(private userRepo: UserRepository) {}

  async register(user: User): Promise<void> {
    // props check.
    await this.userRepo.save(user)
    //publish user registered event.
    // domain event and integrity event
  }
}
