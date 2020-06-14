import { FastifyInstance, FastifyError } from "fastify"
import {
  userOfName,
  userOfId,
  registerUser,
  userLogin,
  userOfToken
} from "./user"
import { App } from "authentication/app"

export const registerAuthenticationRouter: (
  app: App,
  logger: (value: string) => void
) => (
  fastify: FastifyInstance,
  opts: {
    prefix: string
  },
  next: (err?: FastifyError) => void
) => void = (app, logger) => (fastify, opts, next) => {
  fastify.get("/user/ofName/:name", userOfName(app, logger))
  fastify.get("/user/ofId/:id", userOfId(app, logger))
  fastify.post("/user/register", registerUser(app, logger))
  fastify.post("/user/login", userLogin(app, logger))
  fastify.get("/user/ofToken", userOfToken(app, logger))
  next()
}

export const option = {
  prefix: "/authentication"
}
