import { UserRepository } from "../user-repository"
import { User } from "../model/user"
import { UserEventPublisher } from "../event/user-event-publisher"
import { UserNotFound } from "../error/user-not-found"
import { PasswordNotMatched } from "../error/password-not-matched"

export class UserLoginService {
  private userRepository: UserRepository
  private encrypt: (value: string) => string
  private generateToken: (user: User) => string
  private userEventPublisher: UserEventPublisher
  constructor(input: {
    userRepository: UserRepository
    encrypt: (value: string) => string
    generateToken: (user: User) => string
    userEventPublisher: UserEventPublisher
  }) {
    this.userRepository = input.userRepository
    this.encrypt = input.encrypt
    this.generateToken = input.generateToken
    this.userEventPublisher = input.userEventPublisher
  }

  async login(name: string, password: string): Promise<string> {
    const user = await this.userRepository.ofName(name)

    if (!user) {
      throw new UserNotFound()
    }

    if (!user.isPasswordMatched(this.encrypt(password))) {
      throw new PasswordNotMatched("user password not matched.")
    }

    this.userEventPublisher.userLogined({
      id: user.id.toValue(),
      name: user.name
    })

    return this.generateToken(user)
  }
}
