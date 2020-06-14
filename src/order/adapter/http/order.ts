/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest } from "fastify"
import { BaseHttpResponse } from "authentication/adapter/http/base-response"
import { ProductView } from "order/query/domain/order/model/product"
import { OrderDependencies } from "order/dependencies"
import { CreateOrder } from "order/command/application/order/create-order"
import { OrderViewOfId } from "order/query/application/order/of-id"
import { AppendProduct } from "order/command/application/order/append-product"
import { RemoveProduct } from "order/command/application/order/remove-product"

export const createOrder: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    id: string
  }>
> = ({
  orderRepository,
  takeOutRepository,
  crossContextEventPublisher: eventPublisher
}) => {
  return async (request: FastifyRequest) => {
    const { body } = request

    const { createdBy, takeOutId } = body

    const createOrder = new CreateOrder({
      orderRepository,
      takeOutRepository,
      eventPublisher
    })

    const orderId = await createOrder.createBy(createdBy).appendTo(takeOutId)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      },
      data: {
        id: orderId.toValue()
      }
    }
  }
}

export const orderOfId: (
  depends: OrderDependencies,
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
> = ({ orderViewRepository }) => {
  return async (request: FastifyRequest) => {
    const id = request.params.id

    const orderOfId = new OrderViewOfId(orderViewRepository)
    const order = await orderOfId.ofId(id)

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
    const { body } = request
    const { products, orderId } = body

    const removeProduct = new RemoveProduct({
      orderRepository,
      eventPublisher
    })

    await removeProduct.remove(products).from(orderId)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}
