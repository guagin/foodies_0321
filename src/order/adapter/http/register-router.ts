import { FastifyInstance, FastifyError, FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"
import {
  appendProduct,
  createOrder,
  orderOfId,
  removeProduct,
  orderOfPage
} from "./order"
import {
  createMeal,
  launchMeal,
  mealOfId,
  prepareMeal,
  shelveMeal,
  mealsOfPage
} from "./meal"
import {
  createTakeOut,
  takeOutOfId,
  takeOutOfUserId,
  takeOutOfPage
} from "./take-out"
import {
  createProvider,
  changeProviderName,
  changeProviderDescription,
  changeProviderPhone,
  providerOfId,
  providerOfIds,
  providerOfCreatedBy,
  providerOfPage
} from "./provider"
import { OrderDependencies } from "order/dependencies"
import debug from "debug"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HttpHandler = (request: FastifyRequest) => Promise<any>
type Middleware = (
  handler: HttpHandler
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
(request: FastifyRequest) => Promise<any>

const VerifyToken: Middleware = (handler: HttpHandler) => {
  return async (request: FastifyRequest) => {
    const { token } = request.headers
    const user = jwt.verify(token, "imRicky")
    request.headers.user = user
    return handler(request)
  }
}

const WrappedHandler: Middleware = handler => {
  const middlewareLog = debug("debug:middleware: ")
  return async (request: FastifyRequest) => {
    try {
      const data = await handler(request)
      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data
      }
    } catch (e) {
      middlewareLog(e.message)
      return {
        status: {
          code: "ERROR",
          msg: e.message
        }
      }
    }
  }
}

const applyMiddlewares: (
  handler: HttpHandler,
  middlewares: Middleware[]
) => HttpHandler = (handler, middlewares) => {
  const finalHandler = middlewares.reduceRight((result, middleware) => {
    return middleware(result)
  }, handler)

  return finalHandler
}

export const registerOrderRouter: (
  depends: OrderDependencies,
  logger: (value: string) => void
) => (
  fastify: FastifyInstance,
  opts: {
    prefix: string
  },
  next: (err?: FastifyError) => void
) => void = (depends, logger) => (fastify, opt, next) => {
  fastify.post(
    "/order/appendProduct",
    applyMiddlewares(appendProduct(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.post(
    "/meal/create",
    applyMiddlewares(createMeal(depends, logger), [WrappedHandler, VerifyToken])
  )
  fastify.post(
    "/order/create",
    applyMiddlewares(createOrder(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.post(
    "/takeOut/create",
    applyMiddlewares(createTakeOut(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.post(
    "/meal/launch",
    applyMiddlewares(launchMeal(depends, logger), [WrappedHandler, VerifyToken])
  )
  fastify.get(
    "/meal/ofId/:id",
    applyMiddlewares(mealOfId(depends, logger), [WrappedHandler, VerifyToken])
  )
  fastify.get(
    "/order/ofId/:id",
    applyMiddlewares(orderOfId(depends, logger), [WrappedHandler, VerifyToken])
  )
  fastify.post(
    "/meal/prepare",
    applyMiddlewares(prepareMeal(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.post(
    "/order/removeProduct",
    applyMiddlewares(removeProduct(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.post(
    "/meal/shelve",
    applyMiddlewares(shelveMeal(depends, logger), [WrappedHandler, VerifyToken])
  )
  fastify.get(
    "/takeout/ofId/:id",
    applyMiddlewares(takeOutOfId(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.get(
    "/takeout/ofUserId/:userId",
    applyMiddlewares(takeOutOfUserId(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.get(
    "/meal/ofPage",
    applyMiddlewares(mealsOfPage(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )

  fastify.post(
    "/provider/create",
    applyMiddlewares(createProvider(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.post(
    "/provider/changeName",
    applyMiddlewares(changeProviderName(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.post(
    "/provider/changeDescription",
    applyMiddlewares(changeProviderDescription(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.post(
    "/provider/changePhone",
    applyMiddlewares(changeProviderPhone(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  //TODO: provider queries.
  fastify.get(
    "/provider/ofId/:id",
    applyMiddlewares(providerOfId(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )

  fastify.post(
    "/provider/ofIds",
    applyMiddlewares(providerOfIds(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.get(
    "/provider/ofCreatedBy/:userId",
    applyMiddlewares(providerOfCreatedBy(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )

  fastify.get(
    "/provider/ofPage",
    applyMiddlewares(providerOfPage(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  fastify.get(
    "/order/ofPage",
    applyMiddlewares(orderOfPage(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )

  fastify.get(
    "/takeOut/ofPage",
    applyMiddlewares(takeOutOfPage(depends, logger), [
      WrappedHandler,
      VerifyToken
    ])
  )
  next()
}

export const option = {
  prefix: "/order"
}
