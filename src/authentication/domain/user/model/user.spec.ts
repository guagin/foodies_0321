import { User } from "./user"

describe("user test", () => {
  const user = new User(
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
