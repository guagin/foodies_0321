import { Order, OrderId, OrderStatus } from "./order"

describe("create order", () => {
  it("should pass", () => {
    const order = new Order(new OrderId("12345"), {
      createdBy: "6030",
      orderedProducts: [
        {
          id: "p0",
          amount: 0,
          note: ""
        }
      ],
      status: OrderStatus.pended
    })

    expect(order).toBeDefined()
  })

  it("shoul fail for empty createdBy", () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "",
        orderedProducts: [
          {
            id: "p0",
            amount: 0,
            note: ""
          }
        ],
        status: OrderStatus.pended
      })
    }).toThrowError()
  })
})

describe("place order", () => {
  it("should pass", () => {
    const order = new Order(new OrderId("12345"), {
      createdBy: "6030",
      orderedProducts: [
        {
          id: "p0",
          amount: 0,
          note: ""
        }
      ],
      status: OrderStatus.pended
    })
    order.place()
  })

  it("should fail for status not pended or placed", () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "6030",
        orderedProducts: [
          {
            id: "p0",
            amount: 0,
            note: ""
          }
        ],
        status: OrderStatus.canceled
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
        {
          id: "p0",
          amount: 0,
          note: ""
        }
      ],
      status: OrderStatus.placed
    })
    order.cancel()
  })

  it("should fail for order status is not canceled or place", () => {
    expect(() => {
      const order = new Order(new OrderId("12345"), {
        createdBy: "6030",
        orderedProducts: [
          {
            id: "p0",
            amount: 0,
            note: ""
          }
        ],
        status: OrderStatus.pended
      })
      order.cancel()
    }).toThrowError()
  })
})
