import { ProviderViewRepository } from "order/query/domain/provider/provider-view-repository"
import { RepositoryEventPublisher } from "../repository-event-publisher"
import { Saved } from "./saved"
import { ProviderView } from "order/query/domain/provider/model/provider-view"

export class CQRSProviderViewRepository implements ProviderViewRepository {
  constructor(private providerViewRepository: ProviderViewRepository) {}

  listenTo(eventPublisher: RepositoryEventPublisher): void {
    eventPublisher.register<Saved>(Saved.name, async event => {
      const { provider } = event

      await this.save({
        id: provider.id.toValue(),
        name: provider.name,
        createdBy: provider.createdBy,
        description: provider.description,
        phone: provider.phone
      })
    })
  }

  async ofId(id: string): Promise<ProviderView> {
    return this.providerViewRepository.ofId(id)
  }

  async ofIds(ids: string[]): Promise<ProviderView[]> {
    return this.providerViewRepository.ofIds(ids)
  }

  async ofCreatedBy(userId: string): Promise<ProviderView[]> {
    return this.providerViewRepository.ofCreatedBy(userId)
  }

  async ofPage(input: {
    toPage: number
    count: number
  }): Promise<{
    providers: ProviderView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }> {
    return this.providerViewRepository.ofPage(input)
  }

  async save(providerView: ProviderView): Promise<void> {
    return this.providerViewRepository.save(providerView)
  }

  async ofPartialName(input: {
    partialName: string
    count: number
  }): Promise<ProviderView[]> {
    return this.providerViewRepository.ofPartialName(input)
  }
}
