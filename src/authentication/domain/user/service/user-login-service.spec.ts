import { InMemoryUserRepository } from "authentication/infrastructure/persistence/in-memory/user-repository"
import { User } from "../model/user"
import { UserLoginService } from "./user-login-service"
import jwt from "jsonwebtoken"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { UserEventPublisher } from "../event/user-event-publisher"
import { UserLogined } from "event/user-logined"

describe("user login service", () => {
  const userRepository = new InMemoryUserRepository()
  // insert a user.

  const eventPublisher = new SynchronizedDomainEventPublisher()

  const userLoginService = new UserLoginService({
    userRepository: userRepository,
    encrypt: (value: string) => value,
    generateToken: (user: User) => {
      return jwt.sign(
        {
          id: user.id,
          name: user.name
        },
        "imRicky"
      )
    },
    userEventPublisher: new UserEventPublisher(eventPublisher)
  })

  beforeAll(async () => {
    const userId = await userRepository.nextId()
    const user = new User(
      userId,
      {
        name: "ricky",
        password: "123456",
        email: "guagin0972@gmail.com"
      },
      (value: string) => value,
      (value: string) => value
    )

    await userRepository.save(user)
  })

  it("should pass", async () => {
    const eventPromise =new Promise<string>((resolve=>
      {
        eventPublisher.register<UserLogined>("UserLogined", (e)=>{
          resolve(e.payload.id)
        })
      })
    )
    const token = await userLoginService.login(
      "ricky",
      "123456"
    )  
    expect(token).toBeDefined()
    expect(await eventPromise).toBeDefined()
  })

  it("should failed for the password not matched", async () => {
    let error

    try{
      const token = await userLoginService.login("ricky", "")
    }catch(e){
      error =e
    }

    expect(error).toBeDefined()
  })

  it("should failed for user not found", async () => {
    let error
    
    try{
      const token = await userLoginService.login(
        "ricky123",
        "123456"
      )
    }catch(e){
      error =e
    }

    expect(error).toBeDefined()
  })
})
