import { FastifyInstance, FastifyError } from "fastify"
import { makeOfName } from "./of-name"
import { makeOfId } from "./of-id"
import { makeRegister } from "./register"
import { App } from "authentication/app"

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
  fastify.get("/user/ofId/:id", makeOfName(app, logger))
  fastify.get("/user/ofName/:name", makeOfId(app, logger))
  fastify.post("/user/register", makeRegister(app, logger))
  next()
}

export const option = {
  prefix: "/authentication"
}
