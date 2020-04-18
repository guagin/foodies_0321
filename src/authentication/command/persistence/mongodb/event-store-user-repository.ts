import { UserRepository } from "authentication/command/user/user-repository"
import { User, UserId } from "authentication/command/user/model/user"
import { Document, Schema, Model, Connection } from "mongoose"
import { MongoEventStore } from "./mongo-event-store"

// todo: implements this in somewhere else.
const encrypt = (value: string) => value
const decrypt = (value: string) => value

interface UserSnapshot {
  name: string
  password: string
  email: string
}

type UserSnapshotDocument = Document & UserSnapshot

interface UserEvent {
  name: string
}

interface UserEventStream {
  _id: string
  events: UserEvent[]
}

type UserEventStreamDocument = Document & UserEventStream

const UserSnapshotSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
  },
  {
    timestamps: true,
    _id: false
  }
)

const UserEventStreamDocument = new Schema(
  {
    _id: { type: String, required: true },
    events: { type: Schema.Types.Mixed, required: true }
  },
  {
    timestamps: true,
    _id: false
  }
)

export class MongoEventStoreUserRepository
  extends MongoEventStore<UserSnapshotDocument, UserEventStreamDocument>
  implements UserRepository {
  private userSnapshotModel: Model<UserSnapshotDocument>
  private userEventStreamModel: Model<UserEventStreamDocument>
  constructor(depends: { connection: Connection; generateUUID: () => string }) {
    super(depends)
    this.userSnapshotModel = this.depends.connection.model<
      UserSnapshotDocument
    >("userSnapshot", UserSnapshotSchema)

    this.userEventStreamModel = this.depends.connection.model<
      UserEventStreamDocument
    >("userEventStream", UserEventStreamDocument)
  }

  async nextId(): Promise<UserId> {
    return new UserId(this.depends.generateUUID())
  }

  async ofId(id: UserId): Promise<User> {
    const snapshot = await this.userSnapshotModel.findOne({
      _id: id.toValue()
    })
    if (!snapshot) {
      return undefined
    }

    const user = new User(
      id,
      {
        name: snapshot.name,
        password: snapshot.password,
        email: snapshot.email
      },
      encrypt,
      decrypt
    )

    const eventStream = await this.userEventStreamModel.findOne({
      _id: id.toValue()
    })

    if (!eventStream) {
      return user
    }

    user.mutate(eventStream.events)

    return user
  }

  async ofName(name: string): Promise<User> {
    const snapshot = await this.userSnapshotModel.findOne({
      name
    })

    if (!snapshot) {
      return undefined
    }

    const user = new User(
      new UserId(snapshot.id),
      {
        name: snapshot.name,
        password: snapshot.password,
        email: snapshot.email
      },
      encrypt,
      decrypt
    )

    const eventStream = await this.userEventStreamModel.findOne({
      _id: snapshot.id
    })

    if (!eventStream) {
      return user
    }

    user.mutate(eventStream.events)

    return user
  }

  async save(user: User): Promise<void> {
    const foundUserSnapshotDocument = await this.userSnapshotModel.findOne({
      _id: user.id.toValue()
    })

    if (!foundUserSnapshotDocument) {
      const newUserDocument = new this.userSnapshotModel({
        _id: user.id.toValue(),
        name: user.name,
        password: user.password,
        email: user.email
      })

      await newUserDocument.save()
    }

    const foundUserEventStrema = await this.userEventStreamModel.findOne({
      _id: user.id.toValue()
    })

    if (foundUserEventStrema) {
      foundUserEventStrema.events = user.eventStream
      await foundUserEventStrema.save()
    } else {
      const newUserEventStream = new this.userEventStreamModel({
        _id: user.id.toValue(),
        events: user.eventStream
      })
      await newUserEventStream.save()
    }
  }

  async cleanUp(): Promise<void> {
    await this.userSnapshotModel.deleteMany({})
    await this.userEventStreamModel.deleteMany({})
  }
}
