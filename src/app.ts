import debug from "debug"
import { HttpServer } from "http-server"

const logger = debug("app:")

logger("test")

// authenticationServer
const httpServer = HttpServer.getInstance(debug("app:"))
  .then()
  .catch(e => {
    logger(JSON.stringify(e))
  })
