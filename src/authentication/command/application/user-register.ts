import { UserRepository } from "authentication/command/domain/user/user-repository"
import { UserId } from "authentication/command/domain/user/model/user"
import { RegisterService } from "authentication/command/domain/user/service/user-register-service"
import { UserEventPublisher } from "authentication/command/domain/user/event/user-event-publisher"
import { DomainEventPublisher } from "event/domain-event-publisher"

export class UserRegisterUsecase {
  private userRepository: UserRepository
  private eventPublisher: DomainEventPublisher
  private decrypt: (value: string) => string
  private encrypt: (value: string) => string
  private localizeErrorMsg: (value: string) => string

  constructor(input: {
    userRepository: UserRepository
    eventPublisher: DomainEventPublisher
    decrypt: (value: string) => string
    encrypt: (value: string) => string
    localizeErrorMsg: (value: string) => string
  }) {
    this.userRepository = input.userRepository
    this.eventPublisher = input.eventPublisher
    this.decrypt = input.decrypt
    this.encrypt = input.encrypt
    this.localizeErrorMsg = input.localizeErrorMsg
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
      encrypt: this.encrypt,
      localizeErrorMsg: this.localizeErrorMsg
    })

    const userId = await userRegisterService.register({ ...input })
    return userId
  }
}
