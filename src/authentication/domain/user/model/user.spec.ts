import { User, UserId } from "./user"
import { debug } from "debug"

describe("user test", () => {
  it("should pass", () => {
    const user = new User(
      new UserId("0"),
      {
        name: "ricky",
        password: "123456",
        email: "guagin0972@gmail.com"
      },
      (value: string) => value
    )
    const authenticated = user.isPasswordMatched("123456")

    expect(authenticated).toBeTruthy()
  })

  it("should failed for the empty name", () => {
    expect(() => {
      const user = new User(
        new UserId("0"),
        {
          name: "",
          password: "123456",
          email: "guagin0972@gmail.com"
        },
        (value: string) => value
      )
    }).toThrowError()
  })

  it("should failed for the empty password", () => {
    expect(() => {
      const user = new User(
        new UserId("0"),
        {
          name: "ricky",
          password: "",
          email: "guagin0972@gmail.com"
        },
        (value: string) => value
      )
    }).toThrowError()
  })

  it("should failed for the empty email", () => {
    expect(() => {
      const user = new User(
        new UserId("0"),
        {
          name: "ricky",
          password: "123456",
          email: ""
        },
        (value: string) => value
      )
    }).toThrowError()
  })
})
