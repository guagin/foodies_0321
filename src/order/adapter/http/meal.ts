/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest } from "fastify"
import { BaseHttpResponse } from "authentication/adapter/http/base-response"
import { MealView } from "order/query/domain/meal/meal-view"
import { CreateMeal } from "order/command/application/meal/create-meal"
import { MealId } from "order/command/domain/meal/model/meal"
import { OrderDependencies } from "order/dependencies"
import { MealViewOfIdUseCase } from "order/query/application/meal/of-id"
import { LaunchMeal } from "order/command/application/meal/launch-meal"
import { MealViewsOfPage } from "order/query/application/meal/of-page"
import { PrepareMeal } from "order/command/application/meal/prepare-meal"
import { ShelveMeal } from "order/command/application/meal/shelve-meal"

export const createMeal: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    ids: string[]
  }>
> = ({ mealRepository, crossContextEventPublisher }) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const {
      meals
    }: {
      meals: {
        name: string
        price: number
        description: string
        pictures: string[]
        provider: string
        createdBy: string
      }[]
    } = body

    const createMeal = new CreateMeal(
      mealRepository,
      crossContextEventPublisher
    )

    const promiseToCreateMeals: Promise<MealId>[] = []

    meals.forEach(meal => {
      promiseToCreateMeals.push(
        createMeal.create({ ...meal, createdBy: request.headers.user.id })
      )
    })

    const mealIds = await Promise.all(promiseToCreateMeals)

    return {
      data: {
        ids: mealIds.map(mealId => mealId.toValue())
      },
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}

export const mealOfId: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<BaseHttpResponse<{ meal: MealView }>> = ({
  mealViewRepository
}) => {
  return async (request: FastifyRequest) => {
    const mealOfId = new MealViewOfIdUseCase(mealViewRepository)
    const meal = await mealOfId.ofId(request.params.id)

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
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = ({
  mealRepository,
  crossContextEventPublisher
}) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { id } = body

    const launchMeal = new LaunchMeal(
      mealRepository,
      crossContextEventPublisher
    )

    await launchMeal.launch(id)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}

export const mealsOfPage: (
  depends: OrderDependencies,
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
> = ({ mealViewRepository }, logger) => {
  return async request => {
    const { page: pageInput, count } = request.query

    logger(`page: ${pageInput} count: ${count}`)

    const mealsOfPage = new MealViewsOfPage(mealViewRepository)

    const {
      hasNext,
      hasPrevious,
      totalPages,
      page,
      totalCount,
      meals
    } = await mealsOfPage.ofPage({ page: pageInput, count })

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
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = ({
  mealRepository,
  crossContextEventPublisher
}) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { id } = body

    const prepareMeal = new PrepareMeal(
      mealRepository,
      crossContextEventPublisher
    )

    await prepareMeal.prepare(id)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}

export const shelveMeal: (
  depends: OrderDependencies,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<any>> = ({
  mealRepository,
  crossContextEventPublisher
}) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { id } = body

    const shelveMeal = new ShelveMeal(
      mealRepository,
      crossContextEventPublisher
    )

    await shelveMeal.shelve(id)

    return {
      status: {
        code: "SUCCESS",
        msg: ""
      }
    }
  }
}