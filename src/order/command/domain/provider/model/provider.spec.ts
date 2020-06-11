import { Provider, ProviderId } from "./provider"
import faker from "faker"

describe("provider", () => {
  it("should pass", () => {
    const providerId = new ProviderId(faker.random.word())

    const provider = new Provider(providerId, {
      createdBy: faker.random.word(),
      name: faker.random.word(),
      description: faker.random.words(2),
      phone: faker.phone.phoneNumber()
    })

    provider.changeDescription("12345")
    provider.changeName("12345")
    provider.changePhone("12345")

    expect(provider.name).toBe("12345")
    expect(provider.description).toBe("12345")
    expect(provider.phone).toBe("12345")
  })
})
