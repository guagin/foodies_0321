import { App } from "order/app"
import { FastifyRequest } from "fastify"
import { BaseHttpResponse } from "./base-response"
import { ProviderView } from "order/query/domain/provider/model/provider-view"

export const createProvider: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    id: string
  }>
> = app => {
  return async request => {
    const { body } = request
    try {
      const id = await app.createProvider({ ...body })
      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data: {
          id
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message
        }
      }
    }
  }
}

export const changeProviderName: (
  app: App,
  logger: (value: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = app => {
  return async request => {
    const { body } = request
    try {
      await app.changeProviderName({ ...body })
      return {
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message
        }
      }
    }
  }
}

export const changeProviderDescription: (
  app: App,
  logger: (value: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = app => {
  return async request => {
    const { body } = request
    try {
      await app.changeProviderDescription({ ...body })
      return {
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.messsage
        }
      }
    }
  }
}

export const changeProviderPhone: (
  app: App,
  logger: (value: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = app => {
  return async request => {
    const { body } = request
    try {
      await app.changeProviderPhone({ ...body })

      return {
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message
        }
      }
    }
  }
}

export const providerOfId: (
  app: App,
  logger: (value: string) => void
) => (
  request: FastifyRequest
) => Promise<BaseHttpResponse<{ provider: ProviderView }>> = app => {
  return async request => {
    try {
      const provider = await app.providerOfId({ id: request.params.id })
      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data: { provider }
      }
    } catch (e) {
      return {
        status: {
          code: "SUCCESS",
          msg: e.message
        }
      }
    }
  }
}

export const providerOfIds: (
  app: App,
  logger: (value: string) => void
) => (
  request: FastifyRequest
) => Promise<BaseHttpResponse<{ providers: ProviderView[] }>> = app => {
  return async request => {
    const { body } = request
    try {
      const providers = await app.providerOfIds({ ...body })
      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data: {
          providers
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message
        }
      }
    }
  }
}

export const providerOfCreatedBy: (
  app: App,
  logger: (value: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    providers: ProviderView[]
  }>
> = app => {
  return async request => {
    try {
      const providers = await app.providerOfCreatedBy({
        userId: request.params.userId
      })

      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data: {
          providers
        }
      }
    } catch (e) {
      return {
        status: {
          code: "SUCCESS",
          msg: e.message
        }
      }
    }
  }
}

export const providerOfPage: (
  app: App,
  logger: (value: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    providers: ProviderView[]
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
    page: number
  }>
> = app => {
  return async request => {
    const { body } = request
    try {
      const {
        providers,
        hasNext,
        hasPrevious,
        totalPages,
        page,
        totalCount
      } = await app.providerOfPage({ ...body })

      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data: {
          providers,
          hasNext,
          hasPrevious,
          totalPages,
          page,
          totalCount
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message
        }
      }
    }
  }
}
