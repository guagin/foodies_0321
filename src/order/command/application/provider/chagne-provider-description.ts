import { ProviderOfIdService } from "order/command/domain/provider/service/provider-of-id"
import { ProviderRepository } from "order/command/domain/provider/provider-repository"

export class ChangeProviderDescription {
  private providerRepository: ProviderRepository
  constructor({
    providerRepository
  }: {
    providerRepository: ProviderRepository
  }) {
    this.providerRepository = providerRepository
  }

  async changeDescription(id: string, description: string): Promise<void> {
    const providerOfId = new ProviderOfIdService(this.providerRepository)

    const provider = await providerOfId.ofId(id)

    provider.changeDescription(description)

    await this.providerRepository.save(provider)
  }
}
