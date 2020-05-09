import fastify, { FastifyInstance, FastifyError } from "fastify"
import { option } from "./authentication/adapter/http/register-router"

export type registerRouter = (
  fastify: FastifyInstance,
  opts: {
    prefix: string
  },
  next: (err?: FastifyError) => void
) => void

export class HttpServer {
  static instance: HttpServer
  static async getInstance(
    logger: (value: string) => void,
    registerRouters: registerRouter[]
  ): Promise<HttpServer> {
    if (HttpServer.instance) {
      return HttpServer.instance
    }
    const instance = new HttpServer(logger, registerRouters)
    await instance.init()
    HttpServer.instance = instance
    return instance
  }

  private fastifyInstance: FastifyInstance
  private logger: (value: string) => void
  private registerRouters: registerRouter[]

  private constructor(
    logger: (value: string) => void,
    registerRouters: registerRouter[]
  ) {
    this.logger = logger
    this.registerRouters = registerRouters
  }

  private async init(): Promise<void> {
    this.logger("init")
    this.fastifyInstance = fastify({ logger: true })
    this.initParser()
    this.initRoute()
    this.fastifyInstance.listen(3000)
  }

  private initParser(): void {
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
  }

  private initRoute(): void {
    this.logger("init route")
    this.registerRouters.forEach(registerRouter => {
      this.fastifyInstance.register(registerRouter, option)
    })
  }
}
