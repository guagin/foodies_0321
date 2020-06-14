import { FastifyRequest } from "fastify"
import { BaseHttpResponse } from "authentication/adapter/http/base-response"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"
import { OrderDependencies } from "order/dependencies"
import { CreateTakeOut } from "order/command/application/take-out/create-take-out"
import moment from "moment"
import { TakeOutViewOfId } from "order/query/application/take-out/of-id"
import { TakeOutViewOfUserId } from "order/query/application/take-out/of-user-id"

export const createTakeOut: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    id: string
  }>
> = depends => {
  return async (request: FastifyRequest) => {
    const { body } = request

    const { createdBy, title, description, startedAt, endAt } = body

    const createTakeOut = new CreateTakeOut(
      depends.takeOutRepository,
      depends.crossContextEventPublisher
    )

    const takeOutId = await createTakeOut.create({
      createdBy,
      title,
      description,
      startedAt: moment(startedAt).toDate(),
      endAt: moment(endAt).toDate()
    })

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      },
      data: {
        id: takeOutId.toValue()
      }
    }
  }
}

export const takeOutOfId: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<BaseHttpResponse<{ takeOut: TakeOutView }>> = depends => {
  return async (request: FastifyRequest) => {
    const takeOutId = request.params.id
    const takeOutOfId = new TakeOutViewOfId(depends.takeOutViewRepository)
    const takeOutView = await takeOutOfId.ofId(takeOutId)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      },
      data: {
        takeOut: { ...takeOutView }
      }
    }
  }
}

export const takeOutOfUserId: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<BaseHttpResponse<{ takeOuts: TakeOutView[] }>> = depends => {
  return async (request: FastifyRequest) => {
    const userId = request.params.userId
    const takeOutOfUserId = new TakeOutViewOfUserId(
      depends.takeOutViewRepository
    )

    const takeOutViews = await takeOutOfUserId.ofUserId(userId)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      },
      data: {
        takeOuts: takeOutViews
      }
    }
  }
}
