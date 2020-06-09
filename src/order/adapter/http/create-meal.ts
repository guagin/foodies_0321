import { App } from "order/app"
import { FastifyRequest } from "fastify"
import { Status } from "./status"

export const createMeal: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  data?: {
    ids: string[]
  }
  status: Status
}> = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { meals } = body

    const mealIds = await app.createMeals({
      meals,
      createdBy: request.headers.user.id
    })
    return {
      data: {
        ids: mealIds
      },
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}
