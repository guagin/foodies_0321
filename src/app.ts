import debug from "debug"
import { HttpServer } from "authentication/adapter/http/http-server"

const logger = debug("app:")

logger("test")

const httpServer = HttpServer.getInstance(logger)
  .then()
  .catch(e => {
    logger(JSON.stringify(e))
  })
