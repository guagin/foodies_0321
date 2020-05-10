import { App } from "order/app"
import { FastifyRequest } from "fastify"

export const takeOutOfId = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    return app.takeOutOfId({ takeOutId: request.params.id })
  }
}
