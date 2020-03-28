import { UserRepository } from "./domain/user/user-repository"
import { UserRegisterUsecase } from "./application/user-register"
import { UserLoginUseCase } from "./application/user-login"
import jwt from "jsonwebtoken"
import { User } from "./domain/user/model/user"
import { DomainEventPublisher } from "./domain/user/event/domain-event-publisher"
import debug from "debug"

const logger = debug("app:")

export class App {
  private userRepository: UserRepository
  private decrypt: (value: string) => string
  private encrypt: (value: string) => string

  constructor(dependencies: {
    eventPublisher: DomainEventPublisher
    userRepository: UserRepository
  }) {
    this.initEventListener(dependencies.eventPublisher)
    this.userRepository = dependencies.userRepository
    this.decrypt = (value: string) => value
    this.encrypt = (value: string) => value
  }

  private initEventListener(domainEventPublisher: DomainEventPublisher): void {
    /*
    domainEventPublisher.register<CreatedOrder>("CreatedOrder", e => {
      logger(JSON.stringify(logger))
    })
    */
  }

  async register(
    name: string,
    password: string,
    email: string
  ): Promise<{ success: boolean; errorMessage?: string }> {
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository: this.userRepository,
      decrypt: this.decrypt,
      encrypt: this.encrypt
    })

    return userRegisterUseCase.register({
      name,
      password,
      email
    })
  }

  async login(
    name: string,
    password: string
  ): Promise<{ success: boolean; errorMessage?: string }> {
    const userLoginUseCase = new UserLoginUseCase({
      userRepository: this.userRepository,
      generateToken: (user: User) => {
        return jwt.sign(
          {
            id: user.id.toValue(),
            name: user.name,
            email: user.email
          },
          "imRicky"
        )
      },
      encrypt: this.encrypt
    })
    return userLoginUseCase.login({
      name,
      password
    })
  }
}
