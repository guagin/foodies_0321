import { UserRepository } from "authentication/command/domain/user/user-repository"
import { UserId, User } from "authentication/command/domain/user/model/user"
import { RepositoryEventPublisher } from "./repository-event-publisher"
import { Saved } from "./saved"

export class CQRSUserRepository implements UserRepository {
  constructor(
    private userRepository: UserRepository,
    private repositoryEventPublisher: RepositoryEventPublisher
  ) {}
  nextId(): Promise<UserId> {
    return this.userRepository.nextId()
  }
  ofId(id: UserId): Promise<User | undefined> {
    return this.ofId(id)
  }
  ofName(name: string): Promise<User | undefined> {
    return this.userRepository.ofName(name)
  }
  async save(user: User): Promise<void> {
    await this.userRepository.save(user)
    this.repositoryEventPublisher.publish(new Saved(user))
  }
}
