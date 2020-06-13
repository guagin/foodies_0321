import { TakeOut, TakeOutId } from "./take-out"

const Day = 1000 * 60 * 60 * 24

describe("create take out", () => {
  it("should pass", () => {
    const takeOut = new TakeOut(new TakeOutId("t0"), {
      createdBy: "ricky",
      title: "lunch",
      description: "",
      startedAt: new Date(),
      endAt: new Date(Date.now() + Day),
      enabled: true
    })
    expect(takeOut).toBeDefined()
  })
})

describe("isAvailable", () => {
  it("return true", () => {
    const takeOut = new TakeOut(new TakeOutId("t0"), {
      createdBy: "ricky",
      title: "lunch",
      description: "",
      startedAt: new Date(),
      endAt: new Date(Date.now() + Day),
      enabled: true
    })

    expect(takeOut.isAvailable(new Date())).toBe(true)
  })

  it("return false", () => {
    const takeOut = new TakeOut(new TakeOutId("t0"), {
      createdBy: "ricky",
      title: "lunch",
      description: "",
      startedAt: new Date(),
      endAt: new Date(),
      enabled: true
    })

    expect(takeOut.isAvailable(new Date())).toBe(false)
  })
})
