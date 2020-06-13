import { ProviderOfIdService } from "order/command/domain/provider/service/provider-of-id"
import { ProviderRepository } from "order/command/domain/provider/provider-repository"
import { DomainEventPublisher } from "event/domain-event-publisher"
import { ProviderDesciptionChanged } from "event/provider"

export class ChangeProviderDescription {
  private providerRepository: ProviderRepository
  private eventPublisher: DomainEventPublisher
  constructor({
    providerRepository,
    eventPublisher
  }: {
    providerRepository: ProviderRepository
    eventPublisher: DomainEventPublisher
  }) {
    this.providerRepository = providerRepository
    this.eventPublisher = eventPublisher
  }

  async changeDescription(id: string, description: string): Promise<void> {
    const providerOfId = new ProviderOfIdService(this.providerRepository)

    const provider = await providerOfId.ofId(id)

    provider.changeDescription(description)

    await this.providerRepository.save(provider)
    this.eventPublisher.publish(
      new ProviderDesciptionChanged({
        id,
        description
      })
    )
  }
}
