import { Document, Schema, Connection, Model } from "mongoose"
import { MealViewRepository } from "../domain/meal/meal-view-repository"
import { MealView } from "../domain/meal/meal-view"
import { OrderCanceled } from "event/order-cancel"

type MealDocument = Document & {
  id: string
  name: string
  price: number
  description: string
  pictures: string[]
  status: number
  provider: string
}

const MealSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    picture: { type: [String], required: true },
    provider: { type: String, required: true }
  },
  { timestamps: true, _id: false }
)

const generateModelFromDocument: (doc: MealDocument) => MealView = doc => {
  return {
    id: doc._id,
    name: doc.name,
    price: doc.price,
    description: doc.description,
    pictures: doc.pictures,
    status: doc.status,
    provider: doc.provider
  }
}

export class MongoMealViewRepository implements MealViewRepository {
  private model: Model<MealDocument>
  constructor(connection: Connection) {
    this.model = connection.model<MealDocument>("mealView", MealSchema)
  }

  async ofId(id: String): Promise<MealView | undefined> {
    const doc = await this.model.findById(id)

    if (!doc) {
      return undefined
    }

    return generateModelFromDocument(doc)
  }

  async ofName(name: string): Promise<MealView[]> {
    const docs = await this.model.find({ name })

    if (!docs.length) {
      return []
    }

    return docs.map(doc => generateModelFromDocument(doc))
  }

  async ofProvider(provider: string): Promise<MealView[]> {
    const docs = await this.model.find({ provider })

    if (!docs.length) {
      return []
    }

    return docs.map(doc => generateModelFromDocument(doc))
  }

  async save(view: MealView): Promise<void> {
    const found = await this.model.findById(view.id)

    if (found) {
      found.name = view.name
      found.price = view.price
      found.description = view.description
      found.pictures = view.pictures
      found.status = view.status
      found.provider = view.provider
      await found.save()
    } else {
      const toSave = new this.model({
        _id: view.id,
        name: view.name,
        price: view.price,
        description: view.description,
        pictures: view.pictures,
        status: view.status,
        provider: view.provider
      })

      await toSave.save()
    }
  }
}
