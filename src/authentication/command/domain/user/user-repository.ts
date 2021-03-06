import { UserId, User } from "./model/user"

export interface UserRepository {
  nextId(): Promise<UserId>
  ofId(id: UserId): Promise<User | undefined>
  ofName(name: string): Promise<User | undefined>
  save(user: User): Promise<void>
}
