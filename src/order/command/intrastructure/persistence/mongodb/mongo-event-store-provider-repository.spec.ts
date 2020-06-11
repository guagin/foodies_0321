import mongoose from "mongoose"
import { v4 as UUIDV4 } from "uuid"
import faker from "faker"

import { MongoEventStoreProviderRepository } from "./mongo-event-store-provider-repository"
import {
  Provider,
  ProviderId
} from "order/command/domain/provider/model/provider"

describe("mongoEventStoreProviderRepository", () => {
  it("should pass", async () => {
    await mongoose.connect(process.env.mongo_url || "")
    const providerRepository = new MongoEventStoreProviderRepository(
      mongoose.connection,
      () => {
        return UUIDV4()
      }
    )

    const provider = new Provider(new ProviderId(faker.random.word()), {
      createdBy: faker.random.word(),
      name: faker.random.word(),
      description: faker.random.words(),
      phone: faker.random.words()
    })

    await providerRepository.save(provider)

    const saved = await providerRepository.ofId(provider.id.toValue())

    saved.changeName("123456")
    saved.changeDescription("123456")
    saved.changePhone("123456")

    await providerRepository.save(saved)

    const updated = await providerRepository.ofId(provider.id.toValue())

    expect(updated.name).toBe("123456")
    expect(updated.description).toBe("123456")
    expect(updated.phone).toBe("123456")

    await providerRepository.remove([provider.id.toValue()])
  })
})
