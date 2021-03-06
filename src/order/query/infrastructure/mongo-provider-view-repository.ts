import { Document, Connection, Schema, PaginateModel } from "mongoose"
import { ProviderView } from "../domain/provider/model/provider-view"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"
import mognoosePaginate from "mongoose-paginate-v2"
import { ProviderViewRepository } from "../domain/provider/provider-view-repository"

type ProviderDocument = Document & ProviderView

const ProviderViewSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    phone: { type: String },
    createdBy: { type: String, required: true },
    version: { type: Number }
  },
  {
    _id: false,
    timestamps: true,
    versionKey: "version"
  }
)
  .plugin(mognoosePaginate)
  .plugin(updateIfCurrentPlugin)

export class MongoProviderViewRepository implements ProviderViewRepository {
  private model: PaginateModel<ProviderDocument>

  constructor(connection: Connection) {
    this.model = connection.model<ProviderDocument>(
      "ProviderView",
      ProviderViewSchema
    ) as PaginateModel<ProviderDocument>
  }

  async ofId(id: string): Promise<ProviderView | null> {
    const doc = await this.model.findOne({ _id: id })

    if (!doc) {
      return null
    }

    return {
      ...doc.toObject()
    }
  }

  async ofIds(ids: string[]): Promise<ProviderView[]> {
    const docs = await this.model.find({ _id: { $in: ids } })
    if (docs.length === 0) {
      return []
    }

    return docs.map(doc => ({
      ...doc.toObject(),
      id: doc.id
    }))
  }

  async ofCreatedBy(userId: string): Promise<ProviderView[]> {
    const docs = await this.model.find({ createdBy: userId })
    if (docs.length === 0) {
      return []
    }

    return docs.map(doc => ({
      ...doc.toObject(),
      id: doc.id
    }))
  }

  async ofPage({
    toPage,
    count
  }: {
    toPage: number
    count: number
  }): Promise<{
    providers: ProviderView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
    totalCount: number
  }> {
    const {
      docs,
      hasNextPage: hasNext,
      hasPrevPage: hasPrevious,
      totalPages,
      page,
      totalDocs: totalCount
    } = await this.model.paginate(
      {},
      {
        page: toPage,
        limit: count
      }
    )

    return {
      providers: docs.map(doc => ({
        ...doc.toObject(),
        id: doc.id
      })),
      hasNext,
      hasPrevious,
      totalPages,
      totalCount,
      page
    }
  }

  async ofPartialName({
    partialName,
    count
  }: {
    partialName: string
    count: number
  }): Promise<ProviderView[]> {
    const docs = await this.model
      .find({
        name: { $regex: new RegExp(`^${partialName}`) }
      })
      .limit(count)
    return docs.map(doc => ({
      ...doc.toObject(),
      id: doc.id
    }))
  }

  async save(providerView: ProviderView): Promise<void> {
    const found = await this.model.findOne({ _id: providerView.id })

    if (!found) {
      const toSave = new this.model({
        _id: providerView.id,
        createdBy: providerView.createdBy,
        name: providerView.name,
        description: providerView.description,
        phone: providerView.phone
      })

      await toSave.save()
      return
    }

    found.name = providerView.name
    found.description = providerView.description
    found.phone = providerView.phone

    await found.save()
  }
}
