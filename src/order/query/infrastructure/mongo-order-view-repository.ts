import { OrderViewRepository } from "../domain/order/model/order-view-repository"
import { Connection, Document, Model, Schema } from "mongoose"
import { OrderView } from "../domain/order/model/order-view"
import { ProductView } from "../domain/order/model/product"

type OrderViewDocument = Document & {
  id: string
  createdBy: string
  orderProducts: ProductView[]
  status: number
  takeOutId: string
}

const ProductViewSchema = new Schema({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String }
})

const OrderViewSchema = new Schema({
  _id: { type: String, required: true },
  createdBy: { type: String, required: true },
  orderProducts: { type: [ProductViewSchema] },
  status: { type: Number, required: true },
  takeOutId: { type: String, required: true }
})

const generateOrderViewFrom = (doc: OrderViewDocument) => {
  return {
    id: doc._id,
    createdBy: doc.createdBy,
    orderProducts: doc.orderProducts,
    status: doc.status,
    takeOutId: doc.takeOutId
  }
}

export class MongoOrderViewRepository implements OrderViewRepository {
  private model: Model<OrderViewDocument>

  constructor(connection: Connection) {
    this.model = connection.model<OrderViewDocument>(
      "orderview",
      OrderViewSchema
    )
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

  async save(orderView: OrderView): Promise<void> {
    const foundDoc = await this.model.findOne({ _id: orderView.id })
    if (foundDoc) {
      foundDoc.createdBy = orderView.createdBy
      foundDoc.orderProducts = orderView.orderProducts
      foundDoc.status = orderView.status
      foundDoc.takeOutId = orderView.takeOutId
      await foundDoc.save()
    } else {
      const docToSave = new this.model({
        _id: orderView.id,
        createdBy: orderView.createdBy,
        orderProducts: orderView.orderProducts,
        status: orderView.status,
        takeOutId: orderView.takeOutId
      })

      await docToSave.save()
    }
  }
}
