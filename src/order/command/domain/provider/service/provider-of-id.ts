import { ProviderRepository } from "../provider-repository"
import { Provider } from "../model/provider"

export class ProviderOfIdService {
  constructor(private providerRepository: ProviderRepository) {}

  async ofId(id: string): Promise<Provider> {
    const provider = await this.providerRepository.ofId(id)

    if (!provider) {
      throw new Error(`provider not found, id: ${id}`)
    }

    return provider
  }
}
