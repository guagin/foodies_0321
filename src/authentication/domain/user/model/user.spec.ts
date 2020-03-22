import { User, UserId } from "./user"
import { debug } from "debug"

describe("user test", () => {
  const user = new User(
    new UserId("0"),
    {
      name: "ricky",
      password: "123456",
      email: "guagin0972@gmail.com"
    },
    (value: string) => value
  )
  it("should pass", () => {
    const authenticated = user.isPasswordMatched("123456")

    expect(authenticated).toBeTruthy()
  })
})
