import mongoose from "mongoose"
import faker from "faker"
import { App } from "./app"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { MealView } from "./query/domain/meal/meal-view"
import { MealStatus } from "./command/domain/meal/meal"

let app: App

const oneHour = 1000 * 60 * 60
describe("order app, create take out", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.mongo_url)
    app = new App({
      mongoConnection: mongoose.connection,
      crossContextEventPublisher: new SynchronizedDomainEventPublisher()
    })
  })
  it("should pass", async () => {
    const takeOutId = await app.createTakeOut({
      createdBy: faker.random.uuid(),
      title: faker.random.words(10),
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneHour)
    })

    expect(takeOutId).toBeDefined()

    // TODO: should wait untile the takeout created.
    const wait1SecondsPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    await wait1SecondsPromise

    const takeOut = await app.takeOutOfId(takeOutId)

    expect(takeOut).toBeDefined()
  })
})

describe("order app, create order", () => {
  it("should pass", async () => {
    const takeOutId = await app.createTakeOut({
      createdBy: faker.random.uuid(),
      title: faker.random.words(10),
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneHour)
    })

    const orderId = await app.createOrder({
      createdBy: faker.random.uuid(),
      takeOutId
    })

    // TODO: should wait untile the takeout created.
    const wait1SecondsPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    const order = await app.orderOfId(orderId)

    expect(order).toBeDefined()
  })
})

describe("order app, append product", () => {
  it("should pass", async () => {
    const takeOutId = await app.createTakeOut({
      createdBy: faker.random.uuid(),
      title: faker.random.words(10),
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneHour)
    })

    const orderId = await app.createOrder({
      createdBy: faker.random.uuid(),
      takeOutId
    })

    await app.appendProduct({
      products: [
        {
          id: "p01",
          amount: 1000
        }
      ],
      orderId
    })

    // TODO: should wait untile the takeout created.
    const wait1SecondsPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    await wait1SecondsPromise

    const order = await app.orderOfId(orderId)

    expect(order.products.length).toBe(1)
    expect(order.products[0].amount).toBe(1000)
  })

  it("should pass, when push 2 same products", async () => {
    const takeOutId = await app.createTakeOut({
      createdBy: faker.random.uuid(),
      title: faker.random.words(10),
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneHour)
    })

    const orderId = await app.createOrder({
      createdBy: faker.random.uuid(),
      takeOutId
    })

    await app.appendProduct({
      products: [
        {
          id: "p99",
          amount: 1000
        }
      ],
      orderId
    })

    await app.appendProduct({
      products: [
        {
          id: "p99",
          amount: 1000
        }
      ],
      orderId
    })

    // TODO: should wait untile the takeout created.
    const wait1SecondsPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    await wait1SecondsPromise

    const order = await app.orderOfId(orderId)

    expect(order.products.length).toBe(1)
    expect(order.products[0].amount).toBe(2000)
  })
})

describe("order app remove product", () => {
  it("should pass", async () => {
    const takeOutId = await app.createTakeOut({
      createdBy: faker.random.uuid(),
      title: faker.random.words(10),
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneHour)
    })

    const orderId = await app.createOrder({
      createdBy: faker.random.uuid(),
      takeOutId
    })

    await app.appendProduct({
      products: [
        {
          id: "p01",
          amount: 1000
        },
        {
          id: "p02",
          amount: 1000
        }
      ],
      orderId
    })

    await app.removeProduct({
      orderId,
      products: [
        {
          id: "p01",
          amount: 1000
        }
      ]
    })

    // TODO: should wait untile the takeout created.
    const wait1SecondsPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    await wait1SecondsPromise

    const order = await app.orderOfId(orderId)

    expect(order).toBeDefined()
    expect(order.products.length).toEqual(1)
  })

  it("should pass", async () => {
    const takeOutId = await app.createTakeOut({
      createdBy: faker.random.uuid(),
      title: faker.random.words(10),
      description: faker.random.words(10),
      startedAt: new Date(),
      endAt: new Date(Date.now() + oneHour)
    })

    const orderId = await app.createOrder({
      createdBy: faker.random.uuid(),
      takeOutId
    })

    await app.appendProduct({
      products: [
        {
          id: "p01",
          amount: 1001
        },
        {
          id: "p02",
          amount: 1000
        }
      ],
      orderId
    })

    await app.removeProduct({
      orderId,
      products: [
        {
          id: "p01",
          amount: 1
        },
        {
          id: "p02",
          amount: 10
        }
      ]
    })

    // TODO: should wait untile the takeout created.
    const wait1SecondsPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    await wait1SecondsPromise

    const order = await app.orderOfId(orderId)

    console.log(`orderId :${orderId}`)

    expect(order).toBeDefined()
    expect(order.products.length).toEqual(2)
    expect(order.products[0].amount).toEqual(1000)
    expect(order.products[1].amount).toEqual(990)
  })
})

describe("create meal", () => {
  it("should pass", async () => {
    const mealIds = await app.createMeals({
      meals: [
        {
          name: "meal01",
          price: 100,
          description: "meal 1",
          pictures: ["pic1", "pic2"],
          provider: "test"
        },
        {
          name: "meal02",
          price: 100,
          description: "meal 2",
          pictures: ["pic1", "pic2"],
          provider: "test"
        }
      ]
    })

    // TODO: should wait untile the takeout created.
    const wait1SecondsPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    await wait1SecondsPromise

    const promiseToFetchMeals: Promise<MealView>[] = []

    mealIds.forEach(mealId => {
      promiseToFetchMeals.push(app.mealOfId({ mealId }))
    })

    const mealViews = await Promise.all(promiseToFetchMeals)

    expect(mealViews.length).toBe(2)
  })
})

describe("launch meal", () => {
  it("should pass", async () => {
    const mealIds = await app.createMeals({
      meals: [
        {
          name: "meal01",
          price: 100,
          description: "meal 1",
          pictures: ["pic1", "pic2"],
          provider: "test"
        },
        {
          name: "meal02",
          price: 100,
          description: "meal 2",
          pictures: ["pic1", "pic2"],
          provider: "test"
        }
      ]
    })

    await app.launchMeal({ mealId: mealIds[0] })

    // TODO: should wait untile the takeout created.
    const wait1SecondsPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    await wait1SecondsPromise

    const launchedMeal = await app.mealOfId({ mealId: mealIds[0] })

    expect(launchedMeal.status).toBe(MealStatus.launched)
  })
})
