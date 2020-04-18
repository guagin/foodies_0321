import { UserRepository } from "./command/domain/user/user-repository"
import { UserRegisterUsecase } from "./command/application/user-register"
import { UserLoginUseCase } from "./command/application/user-login"
import jwt from "jsonwebtoken"
import { User } from "./command/domain/user/model/user"
import { DomainEventPublisher } from "domain-event-publisher"
import debug from "debug"
import { LocalRepositoryEventPublisher } from "./CQRS-repository/repository-event-publisher"
import { CQRSUserRepository } from "./CQRS-repository/cqrs-user-repository"
import { CQRSUserViewRepository } from "./CQRS-repository/cqrs-user-vew-repository"
import { Connection } from "mongoose"
import { MongoEventStoreUserRepository } from "./command/infrastructure/persistence/mongodb/event-store-user-repository"
import { v4 as uuidV4 } from "uuid"
import { MongoUserViewRepository } from "./query/infrastructure/persistence/mongodb/mongo-user-view-repository"
import { UserOfIdUsaeCase } from "./query/application/user-of-id"
import { UserView } from "./query/domain/user/model/user"

const logger = debug("app:")

export class App {
  private crossContextEventPublisher: DomainEventPublisher

  private userRepository: CQRSUserRepository
  private userViewRepository: CQRSUserViewRepository

  private decrypt: (value: string) => string
  private encrypt: (value: string) => string

  constructor(dependencies: {
    crossContextEventPublisher: DomainEventPublisher
    connection: Connection
  }) {
    this.crossContextEventPublisher = dependencies.crossContextEventPublisher
    this.initCQRSModel(dependencies.connection)
    this.decrypt = (value: string) => value
    this.encrypt = (value: string) => value
  }

  private initCQRSModel(connection: Connection) {
    const eventPublisher = new LocalRepositoryEventPublisher()
    const userRepository = new MongoEventStoreUserRepository({
      connection,
      generateUUID: () => {
        return uuidV4()
      }
    })

    this.userRepository = new CQRSUserRepository(userRepository, eventPublisher)

    const userViewRepository = new MongoUserViewRepository(connection)
    this.userViewRepository = new CQRSUserViewRepository(
      userViewRepository,
      eventPublisher
    )
  }

  async register(
    name: string,
    password: string,
    email: string
  ): Promise<string> {
    const userRegisterUseCase = new UserRegisterUsecase({
      userRepository: this.userRepository,
      eventPublisher: this.crossContextEventPublisher,
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
      eventPublisher: this.crossContextEventPublisher,
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

  async ofId(id: string): Promise<UserView> {
    const ofIdUseCase = new UserOfIdUsaeCase(this.userViewRepository)
    return ofIdUseCase.ofId(id)
  }
}
