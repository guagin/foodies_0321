import { FastifyInstance, FastifyError } from "fastify"
import { userOfName } from "./user-of-name"
import { userOfId } from "./user-of-id"
import { registerUser } from "./user-register"
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
  fastify.get("/user/ofId/:id", userOfName(app, logger))
  fastify.get("/user/ofName/:name", userOfId(app, logger))
  fastify.post("/user/register", registerUser(app, logger))
  next()
}

export const option = {
  prefix: "/authentication"
}
