import { TakeOutId, TakeOut } from "./take-out"

export interface TakeOutRepository {
  nextId(): Promise<TakeOutId>
  ofId(id: TakeOutId): Promise<TakeOut | undefined>
  ofUserId(userId: string): Promise<TakeOut[]>
  save(takeOut: TakeOut): Promise<void>
}
