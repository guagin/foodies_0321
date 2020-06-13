import { Product } from "./product"

describe("create product", () => {
  it("should pass", () => {
    const product = new Product({
      id: "p0",
      amount: 1,
      note: ""
    })

    expect(product).toBeDefined()
  })

  it("should fail for that  the amount is 0", () => {
    expect(() => {
      new Product({
        id: "p0",
        amount: 0,
        note: ""
      })
    }).toThrowError()
  })

  it("should fail for that amount is float number", () => {
    expect(() => {
      new Product({
        id: "p0",
        amount: 0.1,
        note: ""
      })
    }).toThrowError()
  })

  it("should fail for that amount is negative interger", () => {
    expect(() => {
      new Product({
        id: "p0",
        amount: -1,
        note: ""
      })
    }).toThrowError()
  })
})

describe("product increase", () => {
  it("should pass", () => {
    const product = new Product({
      id: "p0",
      amount: 1,
      note: ""
    })

    product.increase(1)
    expect(product.amount).toBe(2)
  })

  it("should fail for that  the amount is 0", () => {
    expect(() => {
      const product = new Product({
        id: "p0",
        amount: 1,
        note: ""
      })

      product.increase(0)
    }).toThrowError()
  })

  it("should fail for that amount is float number", () => {
    expect(() => {
      const product = new Product({
        id: "p0",
        amount: 1,
        note: ""
      })

      product.increase(0.1)
    }).toThrowError()
  })

  it("should fail for that amount is negative interger", () => {
    expect(() => {
      const product = new Product({
        id: "p0",
        amount: 1,
        note: ""
      })

      product.increase(-1)
    }).toThrowError()
  })
})

describe("product decrease", () => {
  it("should pass", () => {
    const product = new Product({
      id: "p0",
      amount: 2,
      note: ""
    })

    product.decrease(1)
    expect(product.amount).toBe(1)
  })

  it("should fail for that  the amount is 0", () => {
    expect(() => {
      const product = new Product({
        id: "p0",
        amount: 1,
        note: ""
      })

      product.decrease(0)
    }).toThrowError()
  })

  it("should fail for that amount is float number", () => {
    expect(() => {
      const product = new Product({
        id: "p0",
        amount: 1,
        note: ""
      })

      product.decrease(0.1)
    }).toThrowError()
  })

  it("should fail for that amount is negative interger", () => {
    expect(() => {
      const product = new Product({
        id: "p0",
        amount: 1,
        note: ""
      })

      product.decrease(-1)
    }).toThrowError()
  })
})
