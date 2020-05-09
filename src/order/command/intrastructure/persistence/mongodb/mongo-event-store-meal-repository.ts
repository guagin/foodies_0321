import { Document, Schema, Model, Connection } from "mongoose"
import { MealRepository } from "order/command/domain/meal/meal-repository"
import { MealEvent } from "order/command/domain/meal/event/meal-event"
import { MealId, Meal } from "order/command/domain/meal/meal"

type MealDocument = Document & {
  name: string
  price: number
  description: string
  pictures: string[]
  status: number
  provider: string
  events: MealEvent[]
}

const MealSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Number, required: true },
    provider: { type: String, required: true },
    events: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true, _id: false }
)

const generateDomainModelFromDoc: (doc: MealDocument) => Meal = doc => {
  const id = new MealId(doc._id)

  const meal = new Meal(id, {
    name: doc.name,
    price: doc.price,
    description: doc.description,
    pictures: doc.pictures,
    status: doc.status,
    provider: doc.provider
  })

  meal.mutate(doc.events, doc.__v || 0)

  return meal
}

export class MongoEventStoreMealRepository implements MealRepository {
  private model: Model<MealDocument>

  constructor(connection: Connection, private generate: () => string) {
    this.model = connection.model<MealDocument>("meal", MealSchema)
  }

  async nextId(): Promise<MealId> {
    return new MealId(this.generate())
  }

  async ofId(id: MealId): Promise<Meal> {
    const doc = await this.model.findById(id.toValue())

    if (!doc) {
      return undefined
    }

    return generateDomainModelFromDoc(doc)
  }

  async save(meal: Meal): Promise<void> {
    const foundDoc = await this.model.findById(meal.id.toValue())
    if (foundDoc) {
      foundDoc.events = meal.events
      foundDoc.__v = meal.version
      await foundDoc.save()
    } else {
      const docToSave = new this.model({
        _id: meal.id.toValue(),
        name: meal.name,
        price: meal.price,
        description: meal.description,
        pictures: meal.pictures,
        events: meal.events,
        provider: meal.provider,
        status: meal.status
      })

      await docToSave.save()
    }
  }
}
