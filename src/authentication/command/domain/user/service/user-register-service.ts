import { UserRepository } from "../user-repository"
import { User, UserId } from "../model/user"
import { UserEventPublisher } from "../event/user-event-publisher"

export class RegisterService {
  private userRepository: UserRepository
  private userEventPublisher: UserEventPublisher
  private decrypt: (value: string) => string
  private encrypt: (value: string) => string

  constructor(input: {
    userRepository: UserRepository
    userEventPublisher: UserEventPublisher
    decrypt: (value: string) => string
    encrypt: (value: string) => string
  }) {
    this.userRepository = input.userRepository
    this.userEventPublisher = input.userEventPublisher
    this.decrypt = input.decrypt
    this.encrypt = input.encrypt
  }

  async register(input: {
    name: string
    password: string
    email: string
  }): Promise<UserId> {
    const { name, password, email } = input
    const foundUser = await this.userRepository.ofName(name)
    if (foundUser) {
      return foundUser.id
    }
    const userId = await this.userRepository.nextId()

    const user = new User(
      userId,
      {
        name: name,
        password: password,
        email: email
      },
      this.decrypt,
      this.encrypt
    )

    await this.userRepository.save(user)

    this.userEventPublisher.userRegistered({
      name: name,
      email: email,
      userId: userId.toValue()
    })

    return userId
  }
}
