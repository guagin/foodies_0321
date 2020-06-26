import { UserView } from "authentication/query/domain/user/model/user"
import { Document, Model, Schema, Connection } from "mongoose"
import { UserViewRepository } from "authentication/query/domain/user/model/user-respository"

type UserViewDocument = Document &
  UserView & {
    createdAt: Date
    updatedAt: Date
  }

const UserViewSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  {
    timestamps: true,
    _id: false
  }
)

export class MongoUserViewRepository implements UserViewRepository {
  private userViewMocdel: Model<UserViewDocument>
  constructor(connection: Connection) {
    this.userViewMocdel = connection.model<UserViewDocument>(
      "UserView",
      UserViewSchema
    )
  }

  async ofId(id: string): Promise<UserView | undefined> {
    return this.userViewMocdel.findOne({ _id: id })
  }

  async ofIds(ids: string[]): Promise<UserView[]> {
    return this.userViewMocdel.find({ _id: { $in: ids } })
  }

  async ofName(name: string): Promise<UserView | undefined> {
    return this.userViewMocdel.findOne({ name: name })
  }

  async save(userView: UserView): Promise<void> {
    const foundUserViewDoc = await this.userViewMocdel.findOne({
      _id: userView.id
    })

    if (foundUserViewDoc) {
      foundUserViewDoc.name = userView.name
      foundUserViewDoc.email = userView.email
      foundUserViewDoc.__v = userView.version
      await foundUserViewDoc.save()
    } else {
      const userViewDoc = new this.userViewMocdel({
        _id: userView.id,
        name: userView.name,
        email: userView.email
      })
      userViewDoc.__v = userView.version

      await userViewDoc.save()
    }
  }
}
