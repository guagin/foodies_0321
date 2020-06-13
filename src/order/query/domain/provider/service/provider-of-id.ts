import { ProviderViewRepository } from "../provider-view-repository"
import { ProviderView } from "../model/provider-view"

export const makeProviderOfIdService: (depends: {
  providerViewRepository: ProviderViewRepository
}) => (id: string) => Promise<ProviderView> = ({ providerViewRepository }) => {
  return async id => {
    const providerView = await providerViewRepository.ofId(id)

    if (!providerView) {
      return null
    }

    return providerView
  }
}
