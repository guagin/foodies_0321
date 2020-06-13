import { ProviderRepository } from "../provider-repository"
import { Provider } from "../model/provider"

export class CreateProviderService {
  constructor(private providerRepository: ProviderRepository) {}

  async create(props: {
    createdBy: string
    name: string
    description: string
    phone: string
  }): Promise<string> {
    const id = await this.providerRepository.nextId()
    const provider = new Provider(id, { ...props })

    await this.providerRepository.save(provider)
    return id.toValue()
  }
}
