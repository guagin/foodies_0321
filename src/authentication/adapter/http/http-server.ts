import fastify, { FastifyInstance } from "fastify"
import { App } from "authentication/app"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import mongoose from "mongoose"
import { makeOfName } from "./of-name"
import { makeOfId } from "./of-id"
import { makeRegister } from "./register"

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
    this.fastifyInstance.addContentTypeParser(
      "application/json",
      { parseAs: "string" },
      function(req, body, done) {
        try {
          var json = JSON.parse(body)
          done(null, json)
        } catch (err) {
          err.statusCode = 400
          done(err, undefined)
        }
      }
    )

    this.fastifyInstance.register(
      (fastify, opts, next) => {
        fastify.get("/user/ofId/:id", makeOfName(app, this.logger))
        fastify.get("/user/ofName/:name", makeOfId(app, this.logger))
        fastify.post("/user/register", makeRegister(app, this.logger))
        next()
      },
      {
        prefix: "/authentication"
      }
    )
  }
}
