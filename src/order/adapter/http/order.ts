/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest } from "fastify"
import { BaseHttpResponse } from "authentication/adapter/http/base-response"
import { ProductView } from "order/query/domain/order/model/product"
import { OrderDependencies } from "order/dependencies"
import { CreateOrder } from "order/command/application/order/create-order"
import { OrderViewOfId } from "order/query/application/order/of-id"
import { AppendProduct } from "order/command/application/order/append-product"
import { RemoveProduct } from "order/command/application/order/remove-product"
import { makeOrderOfPage } from "order/query/application/order/of-page"
import { OrderView } from "order/query/domain/order/model/order-view"
import { makeOrderOfTakeoutId } from "order/query/domain/order/service/order-of-takeout-id-service"
import { makeUpdateProduct } from "order/command/domain/order/service/update-product-amount"
import { OrderId } from "order/command/domain/order/model/order"

export const createOrder: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  id: string
}> = ({
  orderRepository,
  takeOutRepository,
  crossContextEventPublisher: eventPublisher
}) => {
  return async (request: FastifyRequest) => {
    const { takeOutId, meals } = request.body

    const createOrder = new CreateOrder({
      orderRepository,
      takeOutRepository,
      eventPublisher
    })

    const orderId = await createOrder
      .createBy(request.headers.user.id)
      .appendTo(takeOutId)

    const appendProduct = new AppendProduct({
      orderRepository: orderRepository,
      eventPublisher: eventPublisher
    })

    await appendProduct.append(meals).to(orderId.toValue())

    return {
      id: orderId.toValue()
    }
  }
}

export const orderOfId: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  order: {
    id: string
    createdBy: string
    products: ProductView[]
    status: number
    takeOutId: string
  }
}> = ({ orderViewRepository }) => {
  return async (request: FastifyRequest) => {
    const id = request.params.id

    const orderOfId = new OrderViewOfId(orderViewRepository)
    const order = await orderOfId.ofId(id)

    return {
      order
    }
  }
}

export const appendProduct: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = ({
  orderRepository,
  crossContextEventPublisher
}) => {
  return async request => {
    const { body } = request
    const { orderId, products } = body

    const appendProduct = new AppendProduct({
      orderRepository: orderRepository,
      eventPublisher: crossContextEventPublisher
    })

    await appendProduct.append(products).to(orderId)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}

export const removeProduct: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = ({
  orderRepository,
  crossContextEventPublisher: eventPublisher
}) => {
  return async (request: FastifyRequest) => {
    const { index, id } = request.body

    const removeProduct = new RemoveProduct({
      orderRepository,
      eventPublisher
    })

    await removeProduct.remove(index).from(id)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}

export const orderOfPage: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  orders: OrderView[]
  hasNext: boolean
  hasPrevious: boolean
  totalPages: number
  page: number
  totalCount: number
}> = ({ orderViewRepository }, logger) => {
  return async request => {
    const { page: pageInput, count } = request.query

    logger(`page: ${pageInput} count: ${count}`)

    const orderOfPage = makeOrderOfPage(orderViewRepository)
    const result = await orderOfPage({ page: pageInput, count })

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      },
      ...result
    }
  }
}

export const orderOfTakeoutId: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  orders: OrderView[]
}> = ({ orderViewRepository }, logger) => {
  return async request => {
    const { id } = request.params

    logger(`takeoutId: ${id}`)

    const orderOfTakeoutId = makeOrderOfTakeoutId(orderViewRepository)
    const orders = await orderOfTakeoutId({ takeoutId: id })

    logger(`orders: ${orders}`)

    return {
      orders
    }
  }
}

export const updateProduct: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  order: OrderView
}> = ({ orderRepository, orderViewRepository }, logger) => {
  return async request => {
    const { id, index, amount, note } = request.body

    const updateProduct = makeUpdateProduct({
      orderRepository
    })

    await updateProduct({ id: new OrderId(id), index, amount, note })

    const order = await orderViewRepository.ofId(id)

    return {
      order
    }
  }
}
