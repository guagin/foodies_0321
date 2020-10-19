import { FastifyRequest } from "fastify"
import { TakeOutView } from "order/query/domain/take-out/model/take-out-view"
import { OrderDependencies } from "order/dependencies"
import { CreateTakeOut } from "order/command/application/take-out/create-take-out"
import moment from "moment"
import { TakeOutViewOfId } from "order/query/application/take-out/of-id"
import { TakeOutViewOfUserId } from "order/query/application/take-out/of-user-id"
import { makeTakeOutOfPage } from "order/query/application/take-out/of-page"
import { makeTakeOutOfPartiaTitle } from "order/query/application/take-out/of-partial-title"

export const createTakeOut: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  id: string
}> = depends => {
  return async (request: FastifyRequest) => {
    const { title, description, startedAt, endAt, providerId } = request.body

    const createTakeOut = new CreateTakeOut(
      depends.takeOutRepository,
      depends.crossContextEventPublisher
    )

    const takeOutId = await createTakeOut.create({
      createdBy: request.headers.user.id,
      title,
      description,
      providerId,
      startedAt: moment(startedAt).toDate(),
      endAt: moment(endAt).toDate()
    })

    return {
      id: takeOutId.toValue()
    }
  }
}

export const takeOutOfId: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{ takeOut: TakeOutView }> = depends => {
  return async (request: FastifyRequest) => {
    const takeOutId = request.params.id
    const takeOutOfId = new TakeOutViewOfId(depends.takeOutViewRepository)
    const takeOutView = await takeOutOfId.ofId(takeOutId)

    return {
      takeOut: { ...takeOutView }
    }
  }
}

export const takeOutOfUserId: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{ takeOuts: TakeOutView[] }> = depends => {
  return async (request: FastifyRequest) => {
    const userId = request.params.userId
    const takeOutOfUserId = new TakeOutViewOfUserId(
      depends.takeOutViewRepository
    )

    const takeOutViews = await takeOutOfUserId.ofUserId(userId)

    return {
      takeOuts: takeOutViews
    }
  }
}

export const takeOutOfPage: (
  depedns: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  takeOuts: TakeOutView[]
  hasNext: boolean
  hasPrevious: boolean
  totalPages: number
  page: number
  totalCount: number
}> = ({ takeOutViewRepository }) => {
  return async (request: FastifyRequest) => {
    const { page: toPage, count } = request.query

    const takeOutOfPage = makeTakeOutOfPage({
      takeOutViewRepository
    })

    const {
      takeOuts,
      hasNext,
      hasPrevious,
      totalPages,
      page,
      totalCount
    } = await takeOutOfPage({
      count,
      toPage
    })

    return {
      takeOuts,
      hasNext,
      hasPrevious,
      totalPages,
      page,
      totalCount
    }
  }
}

export const takeOutOfPartialTitle: (
  depedns: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  takeOuts: TakeOutView[]
}> = ({ takeOutViewRepository }) => {
  return async request => {
    const { title, count } = request.query
    const takeOutOfPatialTitle = makeTakeOutOfPartiaTitle({
      takeOutViewRepository
    })

    return takeOutOfPatialTitle({ title, count })
  }
}
