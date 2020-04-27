import { TakeOutView } from "./take-out-view"

export interface TakeOutViewRepository {
  ofId(id: string): Promise<TakeOutView | undefined>
  ofUserId(userId: string): Promise<TakeOutView[]>
  save(takeOutView: TakeOutView): Promise<void>
}
