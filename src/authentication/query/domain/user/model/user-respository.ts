import { UserView } from "./user"

export interface UserViewRepository {
  ofId(id: string): Promise<UserView | undefined>
  ofName(name: string): Promise<UserView | undefined>
  save(userView: UserView): Promise<void>
}
