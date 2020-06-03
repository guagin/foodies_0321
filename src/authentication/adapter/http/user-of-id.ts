import { App } from "authentication/app"
import { FastifyRequest } from "fastify"

export const userOfId = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const user = await app.ofId(request.params.id)
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}
