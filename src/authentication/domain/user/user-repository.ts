import { UserId, User } from "./model/user"

export interface UserRepository {
  nextId(): UserId
  ofId(id: UserId): Promise<User | undefined>
  ofName(name: string): Promise<User | undefined>
  save(user: User): Promise<void>
}
