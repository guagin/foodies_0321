import { App } from "order/app"
import { FastifyRequest } from "fastify"

export const mealOfId = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const meal = await app.mealOfId({ mealId: request.params.id })
    return { meal }
  }
}
