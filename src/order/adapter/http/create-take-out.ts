import { FastifyRequest } from "fastify"
import { App } from "order/app"

export const createTakeOut = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const id = await app.createTakeOut(body)
    return { id }
  }
}
