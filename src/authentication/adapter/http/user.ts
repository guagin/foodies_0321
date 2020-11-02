import { App } from "authentication/app"
import { FastifyRequest } from "fastify"
import { BaseHttpResponse } from "./base-response"
import jwt from "jsonwebtoken"
import { UserView } from "authentication/query/domain/user/model/user"

export const userLogin: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    token: string
  }>
> = app => {
  return async (request: FastifyRequest) => {
    const { body } = request
    const { name, password } = body
    try {
      const token = await app.login(name, password)
      return {
        data: {
          token
        },
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message || ""
        }
      }
    }
  }
}

export const userOfId: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<{
  user: {
    id: string
    name: string
    email: string
  }
}> = app => {
  return async request => {
    try {
      const user = await app.ofId(request.params.id)
      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message
        }
      }
    }
  }
}

export const userOfName: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{ id: string; name: string; email: string }>
> = app => {
  return async (request: FastifyRequest) => {
    const user = await app.ofName(request.params.name)
    try {
      return {
        status: {
          code: "SUCCESS",
          msg: ""
        },
        data: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    } catch (e) {
      return {
        status: {
          code: "SUCCESS",
          msg: e.message || ""
        }
      }
    }
  }
}

export const registerUser: (
  app: App,
  logger: (msg: string) => void
) => (request: FastifyRequest) => Promise<BaseHttpResponse<{ id: string }>> = (
  app,
  logger
) => {
  return async request => {
    logger(request.body)
    try {
      const id = await app.register(
        request.body.name,
        request.body.password,
        request.body.email
      )
      return {
        data: { id },
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message || ""
        }
      }
    }
  }
}

export const userOfToken: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    id: string
    name: string
    email: string
  }>
> = app => {
  return async request => {
    try {
      const { token } = request.headers
      const { id } = jwt.decode(token) as {
        id: string
      }

      const user = await app.ofId(id)
      return {
        data: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message || ""
        }
      }
    }
  }
}

export const userOfIds: (
  app: App,
  logger: (msg: string) => void
) => (
  request: FastifyRequest
) => Promise<
  BaseHttpResponse<{
    users: UserView[]
  }>
> = app => {
  return async request => {
    try {
      const { ids } = request.body
      const users = await app.ofIds(ids)

      return {
        data: {
          users
        },
        status: {
          code: "SUCCESS",
          msg: ""
        }
      }
    } catch (e) {
      return {
        status: {
          code: "ERROR",
          msg: e.message || ""
        }
      }
    }
  }
}
