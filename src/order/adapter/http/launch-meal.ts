import { App } from "order/app"
import { FastifyRequest } from "fastify"

export const launchMeal = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { id } = body
    await app.launchMeal(id)
  }
}
