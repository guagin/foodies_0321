import { Meal, MealId, MealStatus } from "./meal"
import faker from "faker"

describe("meal model construct", () => {
  it("should pass", () => {
    const mealId = new MealId("M1")
    const meal = new Meal(mealId, {
      name: "RU_WEI",
      price: 100,
      description: "",
      pictures: [""],
      status: MealStatus.preparing,
      provider: "uber_001",
      createdBy: faker.random.word()
    })
  })
})

describe("prepare", () => {
  it("should success", () => {
    const mealId = new MealId("M1")
    const meal = new Meal(mealId, {
      name: "RU_WEI",
      price: 100,
      description: "",
      pictures: [""],
      status: MealStatus.shelved,
      provider: "uber_001",
      createdBy: faker.random.word()
    })
    meal.prepare()
  })

  it("should failed for that meal is not launched", () => {
    const mealId = new MealId("M1")
    expect(() => {
      const meal = new Meal(mealId, {
        name: "RU_WEI",
        price: 100,
        description: "",
        pictures: [""],
        status: MealStatus.launched,
        provider: "uber_001",
        createdBy: faker.random.word()
      })
      meal.prepare()
    }).toThrowError()
  })
})

describe("launch", () => {
  it("should success", () => {
    const mealId = new MealId("M1")
    const meal = new Meal(mealId, {
      name: "RU_WEI",
      price: 100,
      description: "",
      pictures: [""],
      status: MealStatus.preparing,
      provider: "uber_001",
      createdBy: faker.random.word()
    })
    meal.launch()
  })

  it("should failed for that meal is not preparing", () => {
    const mealId = new MealId("M1")
    expect(() => {
      const meal = new Meal(mealId, {
        name: "RU_WEI",
        price: 100,
        description: "",
        pictures: [""],
        status: MealStatus.shelved,
        provider: "uber_001",
        createdBy: faker.random.word()
      })
      meal.launch()
    }).toThrowError()
  })
})

describe("shelve", () => {
  it("should success", () => {
    const mealId = new MealId("M1")
    const meal = new Meal(mealId, {
      name: "RU_WEI",
      price: 100,
      description: "",
      pictures: [""],
      status: MealStatus.launched,
      provider: "uber_001",
      createdBy: faker.random.word()
    })
    meal.shelve()
  })

  it("should failed for that meal is not launched", () => {
    const mealId = new MealId("M1")
    expect(() => {
      const meal = new Meal(mealId, {
        name: "RU_WEI",
        price: 100,
        description: "",
        pictures: [""],
        status: MealStatus.preparing,
        provider: "uber_001",
        createdBy: faker.random.word()
      })
      meal.shelve()
    }).toThrowError()
  })
})
