import { TakeOutRepository } from "order/command/domain/take-out/model/take-out-repository"
import {
  TakeOutId,
  TakeOut
} from "order/command/domain/take-out/model/take-out"
import { Saved } from "./saved"
import { RepositoryEventPublisher } from "./repository-event-publisher"

export class CQRSTakeOutRepository implements TakeOutRepository {
  constructor(
    private repository: TakeOutRepository,
    private eventPublisher: RepositoryEventPublisher
  ) {}

  async nextId(): Promise<TakeOutId> {
    return this.repository.nextId()
  }

  async ofId(id: TakeOutId): Promise<TakeOut | undefined> {
    return this.repository.ofId(id)
  }

  async ofUserId(userId: string): Promise<TakeOut[]> {
    return this.repository.ofUserId(userId)
  }

  async save(takeOut: TakeOut): Promise<void> {
    await this.repository.save(takeOut)
    this.eventPublisher.publish(new Saved(takeOut))
  }
}
