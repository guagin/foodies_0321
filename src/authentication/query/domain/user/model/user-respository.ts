import { UserView } from "./user"

export interface UserViewRepository {
  ofId(id: string): Promise<UserView | undefined>
  ofIds(ids: string[]): Promise<UserView[]>
  ofName(name: string): Promise<UserView | undefined>
  save(userView: UserView): Promise<void>
}
