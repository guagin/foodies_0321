import { Connection, Document, Model } from "mongoose"

export class MongoEventStore<
  SnapshotDocument extends Document,
  EventStreamDocument extends Document
> {
  constructor(
    protected depends: { connection: Connection; generateUUID: () => string }
  ) {}

  protected async cleanUp(
    snapshotModel: Model<SnapshotDocument>,
    eventStreamModel: Model<EventStreamDocument>
  ): Promise<void> {
    await snapshotModel.deleteMany({})
    await eventStreamModel.deleteMany({})
  }
}
