import { App } from "authentication/app"
import { FastifyRequest } from "fastify"
import { Status } from "./status"

export const userLogin: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{ token?: string; status: Status }> = (app, logger) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { name, password } = body
    try {
      const token = await app.login(name, password)
      return {
        token,
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message
        }
      }
    }
  }
}
