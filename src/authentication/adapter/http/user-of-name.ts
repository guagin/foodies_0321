import { FastifyRequest, FastifyReply } from "fastify"
import { App } from "authentication/app"

export const userOfName = (app: App, logger: (msg: string) => void) => {
  return async (request: FastifyRequest) => {
    const user = await app.ofId(request.params.id)
    logger(`${JSON.stringify(user)}`)
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}
