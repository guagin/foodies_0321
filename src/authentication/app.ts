import { UserRepository } from "./command/user/user-repository"
import { UserRegisterUsecase } from "./command/application/user-register"
import { UserLoginUseCase } from "./command/application/user-login"
import jwt from "jsonwebtoken"
import { User } from "./command/user/model/user"
import { DomainEventPublisher } from "domain-event-publisher"
import debug from "debug"

const logger = debug("app:")

export class App {
  private eventPublisher: DomainEventPublisher
  private userRepository: UserRepository
  private decrypt: (value: string) => string
  private encrypt: (value: string) => string

  constructor(dependencies: {
    eventPublisher: DomainEventPublisher
    userRepository: UserRepository
  }) {
    this.eventPublisher = dependencies.eventPublisher
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
  ): Promise<string> {
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository: this.userRepository,
      eventPublisher: this.eventPublisher,
      decrypt: this.decrypt,
      encrypt: this.encrypt
    })

    const result = await userRegisterUseCase.register({
      name,
      password,
      email
    })

    return result.toValue()
  }

  async login(name: string, password: string): Promise<string> {
    const userLoginUseCase = new UserLoginUseCase({
      userRepository: this.userRepository,
      eventPublisher: this.eventPublisher,
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
    const result = userLoginUseCase.login({
      name,
      password
    })

    return result
  }
}
