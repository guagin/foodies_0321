import { Document, Schema, Connection, Model } from "mongoose"
import { TakeOutRepository } from "order/command/domain/take-out/model/take-out-repository"
import {
  TakeOutId,
  TakeOut
} from "order/command/domain/take-out/model/take-out"
import { TakeOutEvent } from "order/command/domain/take-out/model/event/take-out-event"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

type TakeOutDocument = Document & {
  id: string
  createdBy: string
  title: string
  description: string
  startedAt: Date
  endAt: Date
  enabled: boolean
  events: TakeOutEvent[]
  providerId: string
}

const TakeOutSchema = new Schema(
  {
    _id: { type: String, required: true },
    createdBy: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startedAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    enabled: { type: Boolean, required: true },
    events: { type: Schema.Types.Mixed, required: true },
    providerId: { type: String, required: true }
  },
  { timestamps: true, id: false }
).plugin(updateIfCurrentPlugin)

const domainModelFrom: (doc: TakeOutDocument) => TakeOut = doc => {
  const id = new TakeOutId(doc._id)

  const takeOut = new TakeOut(id, {
    createdBy: doc.createdBy,
    title: doc.title,
    description: doc.description,
    startedAt: doc.startedAt,
    endAt: doc.endAt,
    enabled: doc.enabled,
    providerId: doc.providerId
  })

  takeOut.mutate(doc.events, doc.__v || 0)

  return takeOut
}

export class MongoEventStoreTakeOutRepository implements TakeOutRepository {
  private model: Model<TakeOutDocument>
  constructor(
    connection: Connection,
    private generateUUID: () => Promise<string>
  ) {
    this.model = connection.model<TakeOutDocument>("takeout", TakeOutSchema)
  }

  async nextId(): Promise<TakeOutId> {
    const value = await this.generateUUID()
    return new TakeOutId(value)
  }

  async ofId(takeOutId: TakeOutId): Promise<TakeOut | undefined> {
    const doc = await this.model.findById(takeOutId.toValue())

    if (!doc) {
      return undefined
    }

    return domainModelFrom(doc)
  }

  async ofUserId(userId: string): Promise<TakeOut[]> {
    const docs = await this.model.find({ createdBy: userId })

    if (!docs.length) {
      return []
    }

    return docs.map(doc => domainModelFrom(doc))
  }

  async save(takeOut: TakeOut): Promise<void> {
    const foundDoc = await this.model.findById(takeOut.id.toValue())

    if (foundDoc) {
      foundDoc.events = takeOut.events
      foundDoc.__v = takeOut.version
      await foundDoc.save()
    } else {
      const docToSave = new this.model({
        _id: takeOut.id.toValue(),
        createdBy: takeOut.createdBy,
        title: takeOut.title,
        description: takeOut.description,
        startedAt: takeOut.startedAt,
        endAt: takeOut.endAt,
        enabled: takeOut.enabled,
        events: takeOut.events,
        providerId: takeOut.providerId
      })

      await docToSave.save()
    }
  }
}
