import { Order, OrderId, OrderStatus } from "./order"
import { Product } from "./product"

describe("create order", () => {
  it("should pass", () => {
    const order = new Order(new OrderId("12345"), {
      createdBy: "6030",
      products: [
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
      new Order(new OrderId("12345"), {
        createdBy: "",
        products: [
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
      products: [
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
    expect(order.status).toBe(OrderStatus.placed)
  })

  it("should fail for status not pended or placed", () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "6030",
        products: [
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
        products: [],
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
      products: [
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
    expect(order.status).toBe(OrderStatus.canceled)
  })

  it("should fail for order status is not canceled or place", () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "6030",
        products: [
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
