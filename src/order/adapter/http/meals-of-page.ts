import { FastifyRequest } from "fastify"
import { App } from "order/app"

export const mealsOfPage = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const pageInput = request.query.page

    console.log(`pageInput:  ${pageInput}`)
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
      meals,
      hasNext,
      hasPrevious,
      totalPages,
      page
    }
  }
}
