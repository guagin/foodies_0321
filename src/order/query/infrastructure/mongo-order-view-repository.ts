import { OrderViewRepository } from "../domain/order/model/order-view-repository"
import { Connection, Document, Schema, PaginateModel } from "mongoose"
import { OrderView } from "../domain/order/model/order-view"
import { ProductView } from "../domain/order/model/product"
import mognoosePaginate from "mongoose-paginate-v2"

type OrderViewDocument = Document & {
  id: string
  createdBy: string
  products: ProductView[]
  status: number
  takeOutId: string
}

const ProductViewSchema = new Schema(
  {
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    note: { type: String }
  },
  { _id: false }
)

const OrderViewSchema = new Schema({
  _id: { type: String, required: true },
  createdBy: { type: String, required: true },
  products: { type: [ProductViewSchema] },
  status: { type: Number, required: true },
  takeOutId: { type: String, required: true }
}).plugin(mognoosePaginate)

const generateOrderViewFrom = (doc: OrderViewDocument) => {
  return {
    id: doc._id,
    createdBy: doc.createdBy,
    products: doc.products,
    status: doc.status,
    takeOutId: doc.takeOutId
  }
}

export class MongoOrderViewRepository implements OrderViewRepository {
  private model: PaginateModel<OrderViewDocument>

  constructor(connection: Connection) {
    this.model = connection.model<OrderViewDocument>(
      "orderview",
      OrderViewSchema
    ) as PaginateModel<OrderViewDocument>
  }

  async ofId(id: string): Promise<OrderView | undefined> {
    const result = await this.model.findOne({ _id: id })

    if (!result) {
      return undefined
    }

    return generateOrderViewFrom(result)
  }

  async ofUserId(userId: string): Promise<OrderView[]> {
    const result = await this.model.find({ createdBy: userId })

    if (!result.length) {
      return result
    }

    return result.map(doc => generateOrderViewFrom(doc))
  }

  async ofTakeoutId(takeoutId: string): Promise<OrderView[]> {
    const result = await this.model.find({ takeoutId })

    if (!result.length) {
      return result
    }

    return result.map(doc => generateOrderViewFrom(doc))
  }

  async save(orderView: OrderView): Promise<void> {
    const foundDoc = await this.model.findOne({ _id: orderView.id })
    if (foundDoc) {
      foundDoc.createdBy = orderView.createdBy
      foundDoc.products = orderView.products
      foundDoc.status = orderView.status
      foundDoc.takeOutId = orderView.takeOutId
      await foundDoc.save()
    } else {
      const docToSave = new this.model({
        _id: orderView.id,
        createdBy: orderView.createdBy,
        products: orderView.products,
        status: orderView.status,
        takeOutId: orderView.takeOutId
      })

      await docToSave.save()
    }
  }

  async ofPage({
    page: pageInput,
    count
  }: {
    page: number
    count: number
  }): Promise<{
    orders: OrderView[]
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
      orders: docs.map(doc => generateOrderViewFrom(doc)),
      hasNext: hasNextPage,
      hasPrevious: hasPrevPage,
      page,
      totalCount: totalDocs
    }
  }
}
