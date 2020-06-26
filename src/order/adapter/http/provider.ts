import { FastifyRequest } from "fastify"
import { ProviderView } from "order/query/domain/provider/model/provider-view"
import { CraeteProvider } from "order/command/application/provider/create-provider"
import { OrderDependencies } from "order/dependencies"
import { ChangeProviderPhone } from "order/command/application/provider/change-provider-phone"
import { ChangeProviderName } from "order/command/application/provider/change-provider-name"
import { ChangeProviderDescription } from "order/command/application/provider/chagne-provider-description"
import {
  makeProviderOfId,
  makeProviderOfIds,
  makeProviderOfCreatedBy,
  makeProviderOfPage
} from "order/query/application/provider"

export const createProvider: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  id: string
}> = ({ providerRepository }) => {
  return async request => {
    const { body } = request

    const createProvider = new CraeteProvider({
      providerRepository
    })

    const id = await createProvider.create({
      ...body,
      createdBy: request.headers.user.id
    })

    return {
      id
    }
  }
}

export const changeProviderName: (
  depends: OrderDependencies,
  logger: (value: string) => void
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
(request: FastifyRequest) => Promise<any> = ({
  providerRepository,
  crossContextEventPublisher
}) => {
  return async request => {
    const { body } = request
    const { id, name }: { id: string; name: string } = body

    const changeProviderName = new ChangeProviderName({
      providerRepository: providerRepository,
      eventPublisher: crossContextEventPublisher
    })

    await changeProviderName.changeName({ id, name })

    return {}
  }
}

export const changeProviderDescription: (
  depends: OrderDependencies,
  logger: (value: string) => void
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
(request: FastifyRequest) => Promise<any> = ({
  providerRepository,
  crossContextEventPublisher
}) => {
  return async request => {
    const { body } = request
    const { id, description }: { id: string; description: string } = body

    const changeProviderDescription = new ChangeProviderDescription({
      providerRepository: providerRepository,
      eventPublisher: crossContextEventPublisher
    })

    await changeProviderDescription.changeDescription(id, description)

    return {}
  }
}

export const changeProviderPhone: (
  depends: OrderDependencies,
  logger: (value: string) => void
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
(request: FastifyRequest) => Promise<any> = ({
  providerRepository,
  crossContextEventPublisher
}) => {
  return async request => {
    const { body } = request

    const { id, phone }: { id: string; phone: string } = body

    const changeProviderPhone = new ChangeProviderPhone({
      providerRepository: providerRepository,
      eventPublisher: crossContextEventPublisher
    })

    await changeProviderPhone.changePhone(id, phone)

    return {}
  }
}

export const providerOfId: (
  depends: OrderDependencies,
  logger: (value: string) => void
) => (request: FastifyRequest) => Promise<{ provider: ProviderView }> = ({
  providerViewRepository
}) => {
  return async request => {
    const providerOfId = makeProviderOfId({
      providerViewRepository
    })

    const provider = await providerOfId(request.params.id)

    return {
      provider
    }
  }
}

export const providerOfIds: (
  depends: OrderDependencies,
  logger: (value: string) => void
) => (request: FastifyRequest) => Promise<{ providers: ProviderView[] }> = ({
  providerViewRepository
}) => {
  return async request => {
    const { body } = request
    const { ids }: { ids: string[] } = body

    const providerOfIds = makeProviderOfIds({
      providerViewRepository
    })

    const providers = await providerOfIds(ids)
    return {
      providers
    }
  }
}

export const providerOfCreatedBy: (
  depends: OrderDependencies,
  logger: (value: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  providers: ProviderView[]
}> = ({ providerViewRepository }) => {
  return async request => {
    const providerOfCreatedBy = makeProviderOfCreatedBy({
      providerViewRepository
    })
    const providers = await providerOfCreatedBy(request.params.userId)

    return {
      providers
    }
  }
}

export const providerOfPage: (
  depends: OrderDependencies,
  logger: (value: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  providers: ProviderView[]
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  page: number
}> = ({ providerViewRepository }) => {
  return async request => {
    const { page: toPage, count } = request.query

    const providerOfPage = makeProviderOfPage({
      providerViewRepository
    })

    const {
      providers,
      hasNext,
      hasPrevious,
      totalPages,
      page,
      totalCount
    } = await providerOfPage({ toPage, count })

    return {
      providers,
      hasNext,
      hasPrevious,
      totalPages,
      page,
      totalCount
    }
  }
}
