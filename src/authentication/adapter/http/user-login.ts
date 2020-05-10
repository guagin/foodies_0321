import { App } from "authentication/app"
import { FastifyRequest } from "fastify"

export const userLogin = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { name, password } = body
    const token = await app.login(name, password)
    return {
      token
    }
  }
}
