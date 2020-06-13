/* eslint-disable @typescript-eslint/no-explicit-any */
import { App } from "order/app"
import { FastifyRequest } from "fastify"
import { BaseHttpResponse } from "authentication/adapter/http/base-response"
import { MealView } from "order/query/domain/meal/meal-view"

export const createMeal: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    ids: string[]
  }>
> = app => {
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

export const mealOfId: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<BaseHttpResponse<{ meal: MealView }>> = app => {
  return async (request: FastifyRequest) => {
    const meal = await app.mealOfId({ mealId: request.params.id })
    return {
      status: {
        code: "SUCCESS",
        msg: ""
      },
      data: { meal }
    }
  }
}

export const launchMeal: (
  app: App,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = (
  app: App
) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { id } = body
    await app.launchMeal({ mealId: id })
    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}

export const mealsOfPage: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }>
> = (app, logger) => {
  return async request => {
    const { page: pageInput, count } = request.query

    logger(`page: ${pageInput} count: ${count}`)
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

export const prepareMeal: (
  app: App,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = app => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { id } = body

    await app.prepareMeal(id)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}

export const shelveMeal: (
  app: App,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = app => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { id } = body

    await app.shelveMeal({ mealId: id })

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}
