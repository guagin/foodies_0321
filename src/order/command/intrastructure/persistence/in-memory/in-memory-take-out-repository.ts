import { TakeOutRepository } from "order/command/domain/take-out/model/take-out-repository"
import {
  TakeOut,
  TakeOutId
} from "order/command/domain/take-out/model/take-out"

export class InMemoryTakeOutRepository implements TakeOutRepository {
  private data: TakeOut[]
  constructor() {
    this.data = []
  }

  async nextId(): Promise<TakeOutId> {
    return new TakeOutId(`t${this.data.length}`)
  }

  async ofId(id: TakeOutId): Promise<TakeOut | undefined> {
    return this.data.find(d => d.id.equals(id))
  }

  async ofUserId(userId: string): Promise<TakeOut[]> {
    const takeOuts = this.data.reduce<TakeOut[]>((result, takeOut) => {
      if (takeOut.createdBy === userId) {
        result.push(takeOut)
      }
      return result
    }, [])

    return takeOuts
  }

  async save(takeOut: TakeOut): Promise<void> {
    const foundIndex = this.data.findIndex(elem => elem.id.equals(takeOut.id))
    if (foundIndex > -1) {
      this.data.splice(foundIndex, 1, takeOut)
      return
    }
    this.data.push(takeOut)
  }
}
