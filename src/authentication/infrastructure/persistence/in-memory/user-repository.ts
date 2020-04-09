import { UserRepository } from "authentication/domain/user/user-repository"
import { UserId, User } from "authentication/domain/user/model/user"

export class InMemoryUserRepository implements UserRepository {
  private currentId = 0
  private data: User[]

  constructor() {
    this.data = []
  }

  async nextId(): Promise<UserId> {
    this.currentId = this.currentId + 1
    return new UserId(`${this.currentId}`)
  }

  async ofId(id: UserId): Promise<User | undefined> {
    const found = this.data.find(d => d.isIdMatched(id))
    return found
  }

  async ofName(name: string): Promise<User | undefined> {
    const found = this.data.find(d => d.name === name)
    return found
  }

  async save(user: User): Promise<void> {
    const foundIndex = this.data.findIndex(d => d.equals(user))
    if (foundIndex > -1) {
      this.data.splice(foundIndex, 1, user)
      return
    }
    this.data.push(user)
  }
}
