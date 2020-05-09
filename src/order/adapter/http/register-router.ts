import { FastifyInstance, FastifyError } from "fastify"

import { createTakeOut } from "./create-take-out"
import { App } from "order/app"
import { createOrder } from "./create-order"
import { orderOfId } from "./oder-of-id"

export const makeRegisterRouter = (
  app: App,
  logger: (value: string) => void
) => (
  fastify: FastifyInstance,
  opts: {
    prefix: string
  },
  next: (err?: FastifyError) => void
) => {
  fastify.get("/order/takeout/create", createTakeOut(app, logger))
  fastify.get("/order/create", createOrder(app, logger))
  fastify.post("/order/of/:id", orderOfId(app, logger))

  next()
}

export const option = {
  prefix: "/authentication"
}
