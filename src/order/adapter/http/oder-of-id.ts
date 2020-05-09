import { App } from "order/app"
import { FastifyRequest } from "fastify"

export const orderOfId = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const order = await app.orderOfId(request.params.id)
    return {
      orderView: {
        ...order
      }
    }
  }
}
