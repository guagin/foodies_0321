import { TakeOutViewRepository } from "../model/take-out-view-repository"
import { TakeOutView } from "../model/take-out-view"

export class TakeOutViewOfIdService {
  constructor(private repository: TakeOutViewRepository) {}

  async ofId(id: string): Promise<TakeOutView> {
    const takeOutView = await this.repository.ofId(id)

    if (!takeOutView) {
      throw new Error(`take out view not found, id:${id}`)
    }

    return takeOutView
  }
}
