import { FastifyInstance, FastifyError, FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"
import { App } from "order/app"
import { appendProduct, createOrder, orderOfId, removeProduct } from "./order"
import {
  createMeal,
  launchMeal,
  mealOfId,
  prepareMeal,
  shelveMeal,
  mealsOfPage
} from "./meal"
import { createTakeOut, takeOutOfId, takeOutOfUserId } from "./take-out"

const verifyToken = (handler: (request: FastifyRequest) => void) => {
  return async (request: FastifyRequest) => {
    const { token } = request.headers
    const user = jwt.verify(token, "imRicky")
    request.headers.user = user
    return handler(request)
  }
}

export const registerOrderRouter: (
  app: App,
  logger: (value: string) => void
) => (
  fastify: FastifyInstance,
  opts: {
    prefix: string
  },
  next: (err?: FastifyError) => void
) => void = (app, logger) => (fastify, opt, next) => {
  fastify.post("/order/appendProduct", verifyToken(appendProduct(app, logger)))
  fastify.post("/meal/create", verifyToken(createMeal(app, logger)))
  fastify.post("/order/create", verifyToken(createOrder(app, logger)))
  fastify.post("/takeout/create", verifyToken(createTakeOut(app, logger)))
  fastify.post("/meal/launch", verifyToken(launchMeal(app, logger)))
  fastify.get("/meal/ofId/:id", verifyToken(mealOfId(app, logger)))
  fastify.get("/order/ofId/:id", verifyToken(orderOfId(app, logger)))
  fastify.post("/meal/prepare", verifyToken(prepareMeal(app, logger)))
  fastify.post("/order/removeProduct", verifyToken(removeProduct(app, logger)))
  fastify.post("/meal/shelve", verifyToken(shelveMeal(app, logger)))
  fastify.get("/takeout/ofId/:id", verifyToken(takeOutOfId(app, logger)))
  fastify.get(
    "/takeout/ofUserId/:userId",
    verifyToken(takeOutOfUserId(app, logger))
  )
  fastify.get("/meal/ofPage", verifyToken(mealsOfPage(app, logger)))

  next()
}

export const option = {
  prefix: "/order"
}
