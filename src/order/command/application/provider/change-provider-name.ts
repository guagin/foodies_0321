import { ProviderRepository } from "order/command/domain/provider/provider-repository"
import { ProviderOfIdService } from "order/command/domain/provider/service/provider-of-id"
import { DomainEventPublisher } from "event/domain-event-publisher"
import { ProviderNameChanged } from "event/provider"

export class ChangeProviderName {
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

  async changeName({ id, name }: { id: string; name: string }): Promise<void> {
    const providerOfId = new ProviderOfIdService(this.providerRepository)
    const provider = await providerOfId.ofId(id)

    provider.changeName(name)

    await this.providerRepository.save(provider)

    this.eventPublisher.publish(
      new ProviderNameChanged({
        id,
        name
      })
    )
  }
}
