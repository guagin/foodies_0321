import { FastifyInstance, FastifyError } from "fastify"

import { createTakeOut } from "./create-take-out"
import { App } from "order/app"
import { createOrder } from "./create-order"
import { orderOfId } from "./oder-of-id"
import { appendProduct } from "./append-product"
import { createMeal } from "./create-meal"
import { launchMeal } from "./launch-meal"
import { mealOfId } from "./meal-of-id"
import { prepareMeal } from "./prepare-meal"
import { removeProduct } from "./remove-product"
import { shelveMeal } from "./shelve-meal"

export const registerOrderRouter = (
  app: App,
  logger: (value: string) => void
) => (
  fastify: FastifyInstance,
  opts: {
    prefix: string
  },
  next: (err?: FastifyError) => void
) => {
  fastify.post("/order/appendproduct", appendProduct(app, logger))
  fastify.post("/meal/create", createMeal(app, logger))
  fastify.post("/order/create", createOrder(app, logger))
  fastify.post("/takeout/create", createTakeOut(app, logger))
  fastify.post("/meal/launch", launchMeal(app, logger))
  fastify.get("/meal/ofId/:id", mealOfId(app, logger))
  fastify.get("/order/of/:id", orderOfId(app, logger))
  fastify.post("/meal/prepare", prepareMeal(app, logger))
  fastify.post("/oprder/removeProduct", removeProduct(app, logger))
  fastify.post("/meal/shelve", shelveMeal(app, logger))

  next()
}

export const option = {
  prefix: "/order"
}
