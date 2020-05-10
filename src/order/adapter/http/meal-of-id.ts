import { App } from "order/app"
import { FastifyRequest } from "fastify"

export const mealOfId = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { id } = body
    const meal = await app.mealOfId(id)
    return meal
  }
}
