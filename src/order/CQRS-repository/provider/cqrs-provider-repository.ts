import { ProviderRepository } from "order/command/domain/provider/provider-repository"
import { RepositoryEventPublisher } from "../repository-event-publisher"
import {
  ProviderId,
  Provider
} from "order/command/domain/provider/model/provider"
import { Saved } from "./saved"

export class CQRSProviderRepository implements ProviderRepository {
  constructor(
    private providerRepository: ProviderRepository,
    private eventPublisher: RepositoryEventPublisher
  ) {}

  nextId(): Promise<ProviderId> {
    return this.providerRepository.nextId()
  }
  all(): Promise<Provider[]> {
    return this.providerRepository.all()
  }
  ofId(id: string): Promise<Provider | null> {
    return this.providerRepository.ofId(id)
  }
  async save(provider: Provider): Promise<void> {
    await this.providerRepository.save(provider)
    this.eventPublisher.publish(new Saved(provider))
  }
}
