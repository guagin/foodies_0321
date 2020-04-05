import { TakeOutRepository } from "order/domain/take-out/take-out-repository";
import { TakeOut, TakeOutId } from "order/domain/take-out/take-out";

export class InMemoryTakeOutRepository implements TakeOutRepository{
    private data: TakeOut[]
    constructor(){
        this.data = []
    }

    async nextId(): Promise<TakeOutId>{
        return new TakeOutId(`t${this.data.length}`)
    }

    async ofId(id: TakeOutId): Promise<TakeOut | undefined>{
        return this.data.find(d => d.id.equals(id))
    }

    async save(takeOut: TakeOut): Promise<void>{
        const foundIndex = this.data.findIndex(elem => elem.id.equals(takeOut.id))
    if (foundIndex > -1) {
      this.data.splice(foundIndex, 1, takeOut)
      return
    }
    this.data.push(takeOut)
    }
}