import { ProviderRepository } from "order/command/domain/provider/provider-repository"
import { ProviderOfIdService } from "order/command/domain/provider/service/provider-of-id"

export class ChangeProviderPhone {
  private providerRepository: ProviderRepository

  constructor({
    providerRepository
  }: {
    providerRepository: ProviderRepository
  }) {
    this.providerRepository = providerRepository
  }

  async changePhone(id: string, phone: string): Promise<void> {
    const providerOfId = new ProviderOfIdService(this.providerRepository)

    const provider = await providerOfId.ofId(id)

    provider.changePhone(phone)

    this.providerRepository.save(provider)
  }
}
