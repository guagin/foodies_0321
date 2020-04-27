import { TakeOutViewRepository } from "../domain/take-out/model/take-out-view-repository"
import { Connection, Document, Schema, Model } from "mongoose"
import { TakeOutView } from "../domain/take-out/model/take-out-view"

type TakeOutViewDocument = Document & {
  id: string
  title: string
  createdBy: string
  description: string
  startedAt: Date
  endAt: Date
  enabled: boolean
}

const TakeOutSchema = new Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  createdBy: { type: String, required: true },
  description: { type: String, required: true },
  startedAt: { type: String, required: true },
  endAt: { type: String, required: true },
  enabled: { type: Boolean, required: true }
})

const modelFromDoc: (doc: TakeOutViewDocument) => TakeOutView = doc => {
  return {
    id: doc._id,
    title: doc.title,
    createdBy: doc.createdBy,
    description: doc.description,
    startedAt: doc.startedAt,
    endAt: doc.endAt,
    enabled: doc.enabled
  }
}

export class MongoTakeOutViewRepository implements TakeOutViewRepository {
  private model: Model<TakeOutViewDocument>

  constructor(connection: Connection) {}

  async ofId(id: string): Promise<TakeOutView> {
    const doc = await this.model.findById(id)
    if (!doc) {
      return undefined
    }

    return modelFromDoc(doc)
  }

  async ofUserId(userId: string): Promise<TakeOutView[]> {
    const docs = await this.model.find({ createdBy: userId })

    if (!docs.length) {
      return []
    }

    return docs.map(doc => modelFromDoc(doc))
  }

  async save(view: TakeOutView): Promise<void> {
    const foundDoc = await this.model.findById(view.id)

    if (foundDoc) {
      foundDoc.title = view.title
      foundDoc.createdBy = view.createdBy
      foundDoc.description = view.description
      foundDoc.startedAt = view.startedAt
      foundDoc.endAt = view.endAt
      foundDoc.enabled = view.enabled

      await foundDoc.save()
    } else {
      const docToSave = new this.model({
        _id: view.id,
        createdBy: view.createdBy,
        description: view.description,
        startedAt: view.startedAt,
        endAt: view.endAt,
        enabled: view.enabled
      })

      await docToSave.save()
    }
  }
}
