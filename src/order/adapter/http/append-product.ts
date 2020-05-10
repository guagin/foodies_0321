import { FastifyRequest } from "fastify"
import { App } from "order/app"

export const appendProduct = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { orderId, products } = body
    await app.appendProduct({
      products,
      orderId
    })

    return {}
  }
}
