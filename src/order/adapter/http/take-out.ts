import { FastifyRequest } from "fastify"
import { App } from "order/app"
import { BaseHttpResponse } from "authentication/adapter/http/base-response"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"

export const createTakeOut: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    id: string
  }>
> = app => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const id = await app.createTakeOut({
      ...body,
      createdBy: request.headers.user.id
    })
    return {
      status: {
        code: "SUCCESS",
        msg: ""
      },
      data: {
        id
      }
    }
  }
}

export const takeOutOfId: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<BaseHttpResponse<{ takeOut: TakeOutView }>> = app => {
  return async (request: FastifyRequest) => {
    try {
      const takeOutView = await app.takeOutOfId({
        takeOutId: request.params.id
      })

      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data: {
          takeOut: { ...takeOutView }
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

export const takeOutOfUserId: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<BaseHttpResponse<{ takeOuts: TakeOutView[] }>> = app => {
  return async (request: FastifyRequest) => {
    try {
      const takeOutViews = await app.takeOutOfUserId({
        userId: request.params.userId
      })
      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data: {
          takeOuts: takeOutViews
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
