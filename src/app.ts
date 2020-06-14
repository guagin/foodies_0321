import debug from "debug"
import { HttpServer, Router } from "http-server"
import {
  registerAuthenticationRouter,
  option as authenticationOption
} from "authentication/adapter/http/registe-authentication-router"
import mongoose from "mongoose"
import { App as AuthenticationApp } from "authentication/app"
import {
  registerOrderRouter,
  option as orderOption
} from "order/adapter/http/register-router"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { makeOrderDependencies } from "order/dependencies"
const logger = debug("app:")

const crossContextEventPublisher = new SynchronizedDomainEventPublisher()

const mongoURL = process.env.mongo_url
mongoose
  .connect(mongoURL)
  .then(() => {
    const routers: Router[] = [
      {
        register: registerAuthenticationRouter(
          new AuthenticationApp({
            crossContextEventPublisher,
            mongoConnection: mongoose.connection
          }),
          debug("app:Authentication:")
        ),
        prefix: authenticationOption.prefix
      },
      {
        register: registerOrderRouter(
          makeOrderDependencies({
            crossContextEventPublisher,
            mongoConnection: mongoose.connection
          }),
          debug("app:Order:")
        ),
        prefix: orderOption.prefix
      }
    ]

    return routers
  })
  .then(routers => {
    const httpServer = HttpServer.getInstance(debug("app:"), routers)
    return httpServer
  })
  .catch(e => {
    logger(e)
  })
