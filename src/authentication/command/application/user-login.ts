import { UserLoginService } from "authentication/command/domain/user/service/user-login-service"
import { UserRepository } from "authentication/command/domain/user/user-repository"
import { User } from "authentication/command/domain/user/model/user"
import { DomainEventPublisher } from "event/domain-event-publisher"
import { UserEventPublisher } from "authentication/command/domain/user/event/user-event-publisher"

export class UserLoginUseCase {
  private userRepository: UserRepository
  private generateToken: (user: User) => string
  private encrypt: (value: string) => string
  private eventPublisher: DomainEventPublisher
  constructor(input: {
    userRepository: UserRepository
    generateToken: (user: User) => string
    encrypt: (value: string) => string
    eventPublisher: DomainEventPublisher
  }) {
    this.userRepository = input.userRepository
    this.generateToken = input.generateToken
    this.encrypt = input.encrypt
    this.eventPublisher = input.eventPublisher
  }

  async login(input: { name: string; password: string }): Promise<string> {
    const userLoginService = new UserLoginService({
      userRepository: this.userRepository,
      userEventPublisher: new UserEventPublisher(this.eventPublisher),
      generateToken: this.generateToken,
      encrypt: this.encrypt
    })
    const token = userLoginService.login(input.name, input.password)
    return token
  }
}
