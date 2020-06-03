import { App } from "authentication/app"
import { FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"
import { Status } from "./status"

export const userOfToken: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  id?: string
  name?: string
  email?: string
  status: Status
}> = (app, logger) => {
  return async request => {
    try {
      const { token } = request.headers
      const { id } = jwt.decode(token) as {
        id: string
      }

      const user = await app.ofId(id)
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: ""
        }
      }
    }
  }
}
