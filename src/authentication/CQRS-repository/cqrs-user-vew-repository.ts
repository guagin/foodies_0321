import { UserViewRepository } from "authentication/query/domain/user/model/user-respository"
import { RepositoryEventPublisher } from "./repository-event-publisher"
import { UserView } from "authentication/query/domain/user/model/user"
import { Saved } from "./saved"

export class CQRSUserViewRepository implements UserViewRepository {
  constructor(
    private userViewRepository: UserViewRepository,
    private repositoryEventPublisher: RepositoryEventPublisher
  ) {
    this.repositoryEventPublisher.register<Saved>(Saved.name, e => {
      const { user } = e
      this.userViewRepository.save({
        id: user.id.toValue(),
        name: user.name,
        email: user.email,
        version: user.version
      })
    })
  }
  async save(userView: UserView): Promise<void> {
    this.userViewRepository.save(userView)
  }

  ofId(id: string): Promise<UserView | undefined> {
    return this.userViewRepository.ofId(id)
  }
  ofName(name: string): Promise<UserView | undefined> {
    return this.userViewRepository.ofName(name)
  }

  ofIds(ids: string[]): Promise<UserView[]> {
    return this.userViewRepository.ofIds(ids)
  }
}
