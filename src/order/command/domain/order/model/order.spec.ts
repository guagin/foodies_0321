import { Order, OrderId, OrderStatus } from "./order"
import { Product } from "./product"

describe("create order", () => {
  it("should pass", () => {
    const order = new Order(new OrderId("12345"), {
      createdBy: "6030",
      orderedProducts: [
        new Product({
          id: "p0",
          amount: 1,
          note: ""
        })
      ],
      status: OrderStatus.pended,
      takeOutId: ""
    })

    expect(order).toBeDefined()
  })

  it("shoul fail for empty createdBy", () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "",
        orderedProducts: [
          new Product({
            id: "p0",
            amount: 1,
            note: ""
          })
        ],
        status: OrderStatus.pended,
        takeOutId: ""
      })
    }).toThrowError()
  })
})

describe("place order", () => {
  it("should pass", () => {
    const order = new Order(new OrderId("12345"), {
      createdBy: "6030",
      orderedProducts: [
        new Product({
          id: "p0",
          amount: 1,
          note: ""
        })
      ],
      status: OrderStatus.pended,
      takeOutId: ""
    })
    order.place()
  })

  it("should fail for status not pended or placed", () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "6030",
        orderedProducts: [
          new Product({
            id: "p0",
            amount: 1,
            note: ""
          })
        ],
        status: OrderStatus.canceled,
        takeOutId: ""
      })

      order.place()
    }).toThrowError()
  })

  it("should fail for empty products", () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "6030",
        orderedProducts: [],
        status: OrderStatus.pended,
        takeOutId: ""
      })

      order.place()
    }).toThrowError()
  })
})

describe("cancel order", () => {
  it("should success", () => {
    const order = new Order(new OrderId("12345"), {
      createdBy: "6030",
      orderedProducts: [
        new Product({
          id: "p0",
          amount: 1,
          note: ""
        })
      ],
      status: OrderStatus.placed,
      takeOutId: ""
    })
    order.cancel()
  })

  it("should fail for order status is not canceled or place", () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "6030",
        orderedProducts: [
          new Product({
            id: "p0",
            amount: 1,
            note: ""
          })
        ],
        status: OrderStatus.pended,
        takeOutId: ""
      })
      order.cancel()
    }).toThrowError()
  })
})

describe("increase product", () => {
  it("should pass", () => {
    const order = new Order(new OrderId("12345"), {
      createdBy: "6030",
      orderedProducts: [
        new Product({
          id: "p0",
          amount: 1,
          note: ""
        })
      ],
      status: OrderStatus.pended,
      takeOutId: ""
    })

    order.increaseProductAmount({ productId: "p0", amount: 100 })
    const product = order.products.find(elem => elem.id === "p0")
    expect(product).toBeDefined()
    if (product) {
      expect(product.amount).toBe(101)
    }
  })

  it("should fail for not ordered product", async () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "6030",
        orderedProducts: [
          new Product({
            id: "p0",
            amount: 1,
            note: ""
          })
        ],
        status: OrderStatus.pended,
        takeOutId: ""
      })

      order.increaseProductAmount({ productId: "p1", amount: 100 })
    }).toThrow()
  })
})
