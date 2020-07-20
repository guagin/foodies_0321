import { TakeOutViewRepository } from "order/query/domain/take-out/take-out-view-repository"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"
import { TakeOutViewOfIdService } from "order/query/domain/take-out/service/take-out-of-id-service"

export class TakeOutViewOfId {
  constructor(private repostiroy: TakeOutViewRepository) {}

  async ofId(id: string): Promise<TakeOutView> {
    const takeOutViewOfIdService = new TakeOutViewOfIdService(this.repostiroy)
    return takeOutViewOfIdService.ofId(id)
  }
}
