import { UserRepository } from "../user-repository"
import { User } from "../model/user"
import { DomainEventPublisher } from "../event/domain-event-publisher"
import { UserRegistered } from "../event/user-registered"

export class RegisterService {
  constructor(
    private userRepo: UserRepository,
    private domainEvetnPublisher: DomainEventPublisher
  ) {}

  async register(user: User): Promise<void> {
    await this.userRepo.save(user)

    this.domainEvetnPublisher.publish(
      new UserRegistered(
        {
          name: user.name,
          email: user.email,
          userId: user.id
        },
        "0.0.0.0"
      )
    )
  }
}
