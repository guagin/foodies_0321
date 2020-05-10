import { App } from "order/app"
import { FastifyRequest } from "fastify"

export const createOrder = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const id = await app.createOrder({
      ...body,
      createdBy: request.headers.user.id
    })
    return {
      id
    }
  }
}
