import { App } from "order/app"
import { FastifyRequest } from "fastify"

export const createMeal = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { meals } = body

    const mealIds = await app.createMeals({
      meals,
      createdBy: request.headers.user.id
    })
    return {
      id: mealIds
    }
  }
}
