import { ProviderRepository } from "order/command/domain/provider/provider-repository"
import { CreateProviderService } from "order/command/domain/provider/service/create-provider"

export class CraeteProvider {
  private providerRepository: ProviderRepository

  constructor({
    providerRepository
  }: {
    providerRepository: ProviderRepository
  }) {
    this.providerRepository = providerRepository
  }

  async create(props: {
    createdBy: string
    name: string
    description: string
    phone: string
  }): Promise<string> {
    const createProviderSerivce = new CreateProviderService(
      this.providerRepository
    )

    const id = await createProviderSerivce.create(props)
    return id
  }
}
