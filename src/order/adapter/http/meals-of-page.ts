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
  data?: {
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }
  status: Status
}> = (app, logger) => {
  return async request => {
    const { page: pageInput, count } = request.query

    console.log(`page: ${pageInput} count: ${count}`)
    const {
      meals,
      hasNext,
      hasPrevious,
      totalPages,
      page,
      totalCount
    } = await app.mealOfPage({
      page: pageInput,
      count
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
        totalCount,
        meals
      }
    }
  }
}
