import { FastifyRequest } from "fastify"
import { App } from "order/app"
import { Status } from "authentication/adapter/http/status"
import { MealView } from "order/query/domain/meal/meal-view"

export const mealsOfPage: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  data: {
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
  }
  stataus: Status
}> = (app, logger) => {
  return async request => {
    const pageInput = request.query.page

    const {
      meals,
      hasNext,
      hasPrevious,
      totalPages,
      page
    } = await app.mealOfPage({
      page: pageInput
    })

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      },
      data: {
        hasNext,
        hasPrevious,
        totalPages,
        page,
        meals
      }
    }
  }
}
