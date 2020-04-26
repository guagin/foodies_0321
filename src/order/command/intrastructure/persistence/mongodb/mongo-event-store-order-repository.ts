import { Document, Schema, Model, Connection } from "mongoose"

interface Product {
  id: string
  amount: number
  note: string
}

type OrderDocument = Document & {
  id: string
  createdBy: string
  orderedProducts: Product[]
  status: number
  takeOutId: string
}

const OrderSchema = new Schema({
  _id: { type: String, required: true },
  createdBy: { type: String, required: true },
  orderedProducts: { type: Schema.Types.Mixed, required: true },
  status: { type: Number, required: true },
  note: { type: String },
  events: { type: Schema.Types.Mixed, required: true }
})

export class MongoEventStoreOrderRepository {
  private model: Model<OrderDocument>
  constructor(connection: Connection) {
    this.model = connection.model<OrderDocument>("order", OrderSchema)
  }
}
