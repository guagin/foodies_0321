import fastify, { FastifyInstance, FastifyError } from "fastify"
import fastifyCors from "fastify-cors"

export type registerRouter = (
  fastify: FastifyInstance,
  opts: {
    prefix: string
  },
  next: (err?: FastifyError) => void
) => void

interface Router {
  register: registerRouter
  prefix: string
}

export class HttpServer {
  static instance: HttpServer
  static async getInstance(
    logger: (value: string) => void,
    routers: Router[]
  ): Promise<HttpServer> {
    if (HttpServer.instance) {
      return HttpServer.instance
    }
    const instance = new HttpServer(logger, routers)
    await instance.init()
    HttpServer.instance = instance
    return instance
  }

  private fastifyInstance: FastifyInstance
  private logger: (value: string) => void
  private routers: Router[]

  private constructor(logger: (value: string) => void, routers: Router[]) {
    this.logger = logger
    this.routers = routers
  }

  private async init(): Promise<void> {
    this.logger("init")
    this.fastifyInstance = fastify({ logger: true })
    this.fastifyInstance.register(fastifyCors)
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
    this.routers.forEach(router => {
      this.fastifyInstance.register(router.register, { prefix: router.prefix })
    })
  }
}
