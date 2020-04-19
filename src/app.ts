import debug from "debug"
import { HttpServer } from "authentication/adapter/http/http-server"

const logger = debug("app:")

logger("test")

// authenticationServer
const httpServer = HttpServer.getInstance(debug("app:authentication:"))
  .then()
  .catch(e => {
    logger(JSON.stringify(e))
  })
