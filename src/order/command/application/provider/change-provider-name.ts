import { ProviderRepository } from "order/command/domain/provider/provider-repository"
import { ProviderOfIdService } from "order/command/domain/provider/service/provider-of-id"

export class ChangeProviderName {
  private providerRepository: ProviderRepository
  constructor({
    providerRepository
  }: {
    providerRepository: ProviderRepository
  }) {
    this.providerRepository = providerRepository
  }

  async changeName({ id, name }: { id: string; name: string }): Promise<void> {
    const providerOfId = new ProviderOfIdService(this.providerRepository)
    const provider = await providerOfId.ofId(id)

    provider.changeName(name)

    await this.providerRepository.save(provider)
  }
}
