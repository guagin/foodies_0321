import { App } from "../../app"
import { FastifyRequest } from "fastify"

export const removeProduct = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { products, orderId } = body
    await app.removeProduct({
      orderId,
      products
    })

    return {}
  }
}
