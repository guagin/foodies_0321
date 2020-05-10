import { FastifyRequest } from "fastify"
import { App } from "order/app"

export const takeOutOfUserId = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    return app.takeOutOfUserId({ userId: request.params.userId })
  }
}
