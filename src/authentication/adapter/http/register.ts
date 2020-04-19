import { App } from "authentication/app"
import { FastifyRequest } from "fastify"

export const makeRegister = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    logger(request.body)
    const id = await app.register(
      request.body.name,
      request.body.password,
      request.body.email
    )

    return id
  }
}
