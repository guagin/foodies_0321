import { App } from "authentication/app"
import { FastifyRequest } from "fastify"

export const userOfId = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const user = await app.ofName(request.params.name)
    logger(`${JSON.stringify(user)}`)
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}
