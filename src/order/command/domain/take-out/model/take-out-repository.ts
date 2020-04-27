import { TakeOutId, TakeOut } from "./take-out";

export interface TakeOutRepository{
    nextId(): Promise<TakeOutId>
    ofId(id: TakeOutId): Promise<TakeOut | undefined>
    save(takeOut: TakeOut): Promise<void>
}