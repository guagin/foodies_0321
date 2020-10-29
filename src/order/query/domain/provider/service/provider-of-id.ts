import { ProviderViewRepository } from "../provider-view-repository"
import { ProviderView } from "../model/provider-view"
import { DomainError } from "domain-error"

export const makeProviderOfIdService: (depends: {
  providerViewRepository: ProviderViewRepository
}) => (id: string) => Promise<ProviderView> = ({ providerViewRepository }) => {
  return async id => {
    const providerView = await providerViewRepository.ofId(id)

    if (!providerView) {
      throw new DomainError({
        message: "PROVIDER_NOT_FOUND",
        payload: {
          id
        }
      })
    }

    return providerView
  }
}
