/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest } from "fastify"
import { App } from "order/app"
import { BaseHttpResponse } from "authentication/adapter/http/base-response"
import { ProductView } from "order/query/domain/order/model/product"

export const createOrder: (
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
    const id = await app.createOrder({
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

export const orderOfId: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    orderView: {
      id: string
      createdBy: string
      products: ProductView[]
      status: number
      takeOutId: string
    }
  }>
> = app => {
  return async (request: FastifyRequest) => {
    const order = await app.orderOfId(request.params.id)
    return {
      status: {
        code: "SUCCESS",
        msg: ""
      },
      orderView: {
        ...order
      }
    }
  }
}

export const appendProduct: (
  app: App,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = app => {
  return async request => {
    const { body } = request
    const { orderId, products } = body
    await app.appendProduct({
      products,
      orderId
    })

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}

export const removeProduct: (
  app: App,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = app => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { products, orderId } = body
    await app.removeProduct({
      orderId,
      products
    })

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}
