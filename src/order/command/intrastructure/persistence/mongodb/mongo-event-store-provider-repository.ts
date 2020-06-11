import { Document, Model, Schema, Connection } from "mongoose"
import { ProviderEvent } from "order/command/domain/provider/model/event/provider-event"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
import { ProviderRepository } from "order/command/domain/provider/provider-repository"
import {
  ProviderId,
  Provider
} from "order/command/domain/provider/model/provider"

type ProviderDocument = Document & {
  createdBy: string
  name: string
  description: string
  phone: string
  events: ProviderEvent[]
}

const ProviderSchema = new Schema(
  {
    _id: { type: String, required: true },
    createdBy: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    events: { type: Schema.Types.Mixed, required: true }
  },
  {
    timestamps: true,
    _id: false
  }
).plugin(updateIfCurrentPlugin)

const genreateProviderFrom: (doc: ProviderDocument) => Provider = doc => {
  const id = new ProviderId(doc._id)

  const provider = new Provider(id, {
    createdBy: doc.createdBy,
    name: doc.name,
    description: doc.description,
    phone: doc.phone
  })

  provider.mutate(doc.events, doc.__v || 0)

  return provider
}

export class MongoEventStoreProviderRepository implements ProviderRepository {
  private model: Model<ProviderDocument>
  constructor(connection: Connection, private generateUUID: () => string) {
    this.model = connection.model<ProviderDocument>(
      "Provider",
      ProviderSchema,
      "Provider"
    )
  }

  async nextId(): Promise<ProviderId> {
    return new ProviderId(this.generateUUID())
  }

  async all(): Promise<Provider[]> {
    const docs = await this.model.find()
    return docs.map(doc => genreateProviderFrom(doc))
  }

  async ofId(id: string): Promise<Provider | null> {
    const doc = await this.model.findOne({ _id: id })

    if (!doc) {
      return null
    }

    return genreateProviderFrom(doc)
  }

  async save(provider: Provider): Promise<void> {
    let foundDoc = await this.model.findById(provider.id.toValue())

    if (foundDoc) {
      foundDoc.events = provider.events
      await foundDoc.save()
      return
    }

    const docToSave = new this.model({
      _id: provider.id.toValue(),
      createdBy: provider.createdBy,
      name: provider.name,
      description: provider.description,
      phone: provider.phone,
      events: provider.events
    })

    await docToSave.save()
  }

  async remove(ids: string[]): Promise<void> {
    await this.model.remove({ _id: { $in: ids } })
  }
}
