import { Document, Schema, Connection, PaginateModel } from "mongoose"
import { MealViewRepository } from "../domain/meal/meal-view-repository"
import { MealView } from "../domain/meal/meal-view"
import mognoosePaginate from "mongoose-paginate-v2"

type MealDocument = Document & {
  id: string
  name: string
  price: number
  description: string
  pictures: string[]
  status: number
  provider: string
  createdBy: string
}

const MealSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    picture: { type: [String], required: true },
    status: { type: Number, required: true },
    provider: { type: String, required: true },
    createdBy: { type: String, required: true }
  },
  { timestamps: true, _id: false }
).plugin(mognoosePaginate)

const generateModelFromDocument: (doc: MealDocument) => MealView = doc => {
  return {
    id: doc._id,
    name: doc.name,
    price: doc.price,
    description: doc.description,
    pictures: doc.pictures,
    status: doc.status,
    provider: doc.provider,
    createdBy: doc.createdBy
  }
}

export class MongoMealViewRepository implements MealViewRepository {
  private model: PaginateModel<MealDocument>
  constructor(connection: Connection) {
    this.model = connection.model<MealDocument>(
      "mealView",
      MealSchema
    ) as PaginateModel<MealDocument>
  }

  async ofId(id: string): Promise<MealView | undefined> {
    const doc = await this.model.findById(id)

    if (!doc) {
      return undefined
    }

    return generateModelFromDocument(doc)
  }

  async ofIds(ids: string[]): Promise<MealView[]> {
    const docs = await this.model.find({ _id: { $in: ids } })

    return docs.map(doc => generateModelFromDocument(doc))
  }

  async ofName(name: string): Promise<MealView[]> {
    const docs = await this.model.find({ name })

    if (!docs.length) {
      return []
    }

    return docs.map(doc => generateModelFromDocument(doc))
  }

  async ofPage({
    page: pageInput,
    count
  }: {
    page: number
    count: number
  }): Promise<{
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }> {
    const {
      docs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page,
      totalDocs
    } = await this.model.paginate(
      {},
      {
        page: pageInput,
        limit: count
      }
    )

    return {
      totalPages,
      meals: docs.map(doc => generateModelFromDocument(doc)),
      hasNext: hasNextPage,
      hasPrevious: hasPrevPage,
      page,
      totalCount: totalDocs
    }
  }

  async ofProvider({
    page: pageInput,
    count,
    providerId: provider
  }: {
    page: number
    count: number
    providerId?: string
  }): Promise<{
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }> {
    const {
      docs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page,
      totalDocs
    } = await this.model.paginate(
      {
        provider
      },
      {
        page: pageInput,
        limit: count
      }
    )

    return {
      totalPages,
      meals: docs.map(doc => generateModelFromDocument(doc)),
      hasNext: hasNextPage,
      hasPrevious: hasPrevPage,
      page,
      totalCount: totalDocs
    }
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
      found.createdBy = view.createdBy
      await found.save()
    } else {
      const toSave = new this.model({
        _id: view.id,
        name: view.name,
        price: view.price,
        description: view.description,
        pictures: view.pictures,
        status: view.status,
        provider: view.provider,
        createdBy: view.createdBy
      })

      await toSave.save()
    }
  }
}
