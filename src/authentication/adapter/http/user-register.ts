import { App } from "authentication/app"
import { FastifyRequest } from "fastify"
import { Status } from "./status"

export const registerUser: (
  app: App,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<{ id: string; status: Status }> = (
  app,
  logger
) => {
  return async request => {
    logger(request.body)
    try {
      const id = await app.register(
        request.body.name,
        request.body.password,
        request.body.email
      )
      return {
        id,
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        id: e.id,
        status: {
          code: "ERROR",
          msg: e.message || ""
        }
      }
    }
  }
}
