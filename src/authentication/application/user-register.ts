import { UserRepository } from "authentication/domain/user/user-repository"
import { User, UserId } from "authentication/domain/user/model/user"
import { RegisterService } from "authentication/domain/user/service/user-register-service"
import { UserEventPublisher } from "authentication/domain/user/event/user-event-publisher"
import { DomainEventPublisher } from "domain-event-publisher"

export class UserRegisterUsecase {
  private userRepository: UserRepository
  private eventPublisher: DomainEventPublisher
  private decrypt: (value: string) => string
  private encrypt: (value: string) => string

  constructor(input: {
    userRepository: UserRepository
    eventPublisher: DomainEventPublisher
    decrypt: (value: string) => string
    encrypt: (value: string) => string
  }) {
    this.userRepository = input.userRepository
    this.eventPublisher = input.eventPublisher
    this.decrypt = input.decrypt
    this.encrypt = input.encrypt
  }

  async register(input: {
    name: string
    password: string
    email: string
  }): Promise<UserId> {
    const userRegisterService = new RegisterService({
      userRepository: this.userRepository,
      userEventPublisher: new UserEventPublisher(this.eventPublisher),
      decrypt: this.decrypt,
      encrypt: this.encrypt
    })

    const userId = await userRegisterService.register({ ...input})
    return userId
  }
}
