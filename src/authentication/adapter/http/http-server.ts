import fastify, { FastifyInstance } from "fastify"
import { App } from "authentication/app"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import mongoose from "mongoose"

export class HttpServer {
  static instance: HttpServer
  static async getInstance(
    logger: (value: string) => void
  ): Promise<HttpServer> {
    if (HttpServer.instance) {
      return HttpServer.instance
    }
    const instance = new HttpServer(logger)
    await instance.init()
    HttpServer.instance = instance
    return instance
  }

  private fastifyInstance: FastifyInstance
  private logger: (value: string) => void
  private constructor(logger: (value: string) => void) {
    this.logger = logger
  }

  private async init(): Promise<void> {
    this.logger("init")
    this.fastifyInstance = fastify({ logger: true })

    await mongoose.connect(process.env.mongo_url)

    const app = new App({
      crossContextEventPublisher: new SynchronizedDomainEventPublisher(),
      mongoConnection: mongoose.connection
    })

    this.initRoute(app)
    this.fastifyInstance.listen(3000)
  }

  private initRoute(app: App): void {
    this.logger("init route")
    this.fastifyInstance.route({
      method: "GET",
      url: "/authentication/user/ofId/:id",
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" }
            }
          }
        }
      },
      handler: async (request, reply) => {
        const user = await app.ofId(request.params.id)
        this.logger(`${JSON.stringify(user)}`)
        reply.send({
          id: user.id,
          name: user.name,
          email: user.email
        })
      }
    })
  }
}
