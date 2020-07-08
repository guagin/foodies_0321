import { ProviderViewRepository } from "../domain/provider/provider-view-repository"
import { ProviderView } from "../domain/provider/model/provider-view"
import { makeProviderOfIdService } from "../domain/provider/service/provider-of-id"

export const makeProviderOfId: (depends: {
  providerViewRepository: ProviderViewRepository
}) => (id: string) => Promise<ProviderView> = ({ providerViewRepository }) => {
  const providerOfId = makeProviderOfIdService({ providerViewRepository })
  return async id => {
    return providerOfId(id)
  }
}

export const makeProviderOfIds: (depends: {
  providerViewRepository: ProviderViewRepository
}) => (ids: string[]) => Promise<ProviderView[]> = ({
  providerViewRepository
}) => {
  return async ids => {
    return providerViewRepository.ofIds(ids)
  }
}

export const makeProviderOfCreatedBy: (depends: {
  providerViewRepository: ProviderViewRepository
}) => (userId: string) => Promise<ProviderView[]> = ({
  providerViewRepository
}) => {
  return async userId => {
    return providerViewRepository.ofCreatedBy(userId)
  }
}

export const makeProviderOfPage: (depends: {
  providerViewRepository: ProviderViewRepository
}) => (input: {
  toPage: number
  count: number
}) => Promise<{
  providers: ProviderView[]
  hasNext: boolean
  hasPrevious: boolean
  totalPages: number
  page: number
  totalCount: number
}> = ({ providerViewRepository }) => {
  return async ({ toPage, count }) => {
    return providerViewRepository.ofPage({ toPage, count })
  }
}

export const makeProviderOfPartialName: (depends: {
  providerViewRepository: ProviderViewRepository
}) => (input: {
  partialName: string
  count: number
}) => Promise<{
  providers: ProviderView[]
}> = ({ providerViewRepository }) => {
  return async ({ partialName, count }) => {
    return {
      providers: await providerViewRepository.ofPartialName({
        partialName,
        count
      })
    }
  }
}
