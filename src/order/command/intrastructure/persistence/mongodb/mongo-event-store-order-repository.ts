import { Document, Schema, Model, Connection } from "mongoose"
import { OrderRepository } from "order/command/domain/order/model/order-repository"
import { OrderId, Order } from "order/command/domain/order/model/order"
import { OrderEvent } from "order/command/domain/order/model/event/order-event"
import { Product } from "order/command/domain/order/model/product"
import debug from "debug"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

const logger = debug("debug:MongoEventStoreOrderRepository")

interface ProductDocument {
  id: string
  amount: number
  note: string
}

type OrderDocument = Document & {
  id: string
  createdBy: string
  products: ProductDocument[]
  status: number
  takeOutId: string
  events: OrderEvent[]
}

const generateOrderFromDocument: (doc: OrderDocument) => Order = (
  doc: OrderDocument
) => {
  const products = doc.products.map(p => {
    return new Product({
      id: p.id,
      amount: p.amount,
      note: p.note
    })
  })

  const order = new Order(new OrderId(doc.id), {
    createdBy: doc.createdBy,
    products: products,
    status: doc.status,
    takeOutId: doc.takeOutId
  })

  order.mutate(doc.events, doc.__v)
  return order
}

const ProductSchema = new Schema(
  {
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    note: { type: String, default: "" }
  },
  { _id: false }
)

const OrderSchema = new Schema(
  {
    _id: { type: String, required: true },
    createdBy: { type: String, required: true },
    products: { type: [ProductSchema], default: [] },
    status: { type: Number, required: true },
    note: { type: String },
    events: { type: Schema.Types.Mixed, required: true },
    takeOutId: { type: String, required: true }
  },
  {
    timestamps: true,
    _id: false
  }
).plugin(updateIfCurrentPlugin)

export class MongoEventStoreOrderRepository implements OrderRepository {
  private model: Model<OrderDocument>
  constructor(connection: Connection, private generateUUID: () => string) {
    this.model = connection.model<OrderDocument>("order", OrderSchema)
  }

  async nextId(): Promise<OrderId> {
    return new OrderId(this.generateUUID())
  }

  async ofId(orderId: OrderId): Promise<Order | undefined> {
    const foundDoc = await this.model.findById(orderId.toValue())

    if (!foundDoc) {
      return undefined
    }

    return generateOrderFromDocument(foundDoc)
  }

  async ofUserId(userId: string): Promise<Order[]> {
    const foundDocs = await this.model.find({ createdBy: userId })

    if (!foundDocs) {
      return []
    }

    return foundDocs.map(doc => generateOrderFromDocument(doc))
  }

  async save(order: Order): Promise<void> {
    const foundDoc = await this.model.findById(order.id.toValue())

    if (foundDoc) {
      foundDoc.events = order.events
      foundDoc.__v = order.version
      await foundDoc.save()
      return
    }

    const doc = new this.model({
      _id: order.id.toValue(),
      createdBy: order.createdBy,
      products: order.products,
      status: order.status,
      takeOutId: order.takeOutId,
      events: order.events
    })

    await doc.save()
  }
}
