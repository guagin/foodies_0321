import { User, UserId } from "./user"

describe("create user instance ", () => {
  it("should pass", () => {
    const user = new User(
      new UserId("0"),
      {
        name: "ricky",
        password: "123456",
        email: "guagin0972@gmail.com"
      },
      (value: string) => value,
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
        (value: string) => value,
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
        (value: string) => value,
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
        (value: string) => value,
        (value: string) => value
      )
    }).toThrowError()
  })
})

describe("change email", ()=>{
  it('should pass', ()=>{
    const user = new User(
      new UserId("0"),
      {
        name: "ricky",
        password: "123456",
        email: "123"
      },
      (value: string) => value,
      (value: string) => value
    )

    user.changeEmail("456")

    expect(user.email).toBe('456')
  })
})


describe("change password", ()=>{
  it('should pass', ()=>{
    const user = new User(
      new UserId("0"),
      {
        name: "ricky",
        password: "123456",
        email: "123"
      },
      (value: string) => value,
      (value: string) => value
    )

    user.changePassword("456")

    expect(user.isPasswordMatched('456')).toBeTruthy()
  })
})