import { Connection } from "mongoose"

import { DomainEventPublisher } from "domain-event-publisher"
import { OrderId } from "./command/domain/order/model/order"
import { CreateOrder } from "./command/application/create-order"
import { CQRSOrderRepository } from "./CQRS-repository/cqrs-order-repository"
import { CQRSOrderViewRepository } from "./CQRS-repository/cqrs-order-view-repository"
import { MongoEventStoreOrderRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-order-repository"
import { v4 as UUIDV4 } from "uuid"
import { SynchronizedDomainEventPublisher } from "synchronized-domain-event-publisher"
import { LocalRepositoryEventPublisher } from "./CQRS-repository/repository-event-publisher"
import { MongoOrderViewRepository } from "./query/infrastructure/mongo-order-view-repository"

export class App {
  private mongoConnection: Connection
  private crossContextEventPublisher: DomainEventPublisher
  private orderRepository: CQRSOrderRepository
  private orderViewRepository: CQRSOrderViewRepository

  constructor(depends: {
    mongoConnection: Connection
    crossContextEventPublisher: DomainEventPublisher
  }) {
    this.crossContextEventPublisher = depends.crossContextEventPublisher
    this.mongoConnection = depends.mongoConnection

    this.initCQRSRepositories()
  }

  private initCQRSRepositories(): void {
    const eventPublisher = new LocalRepositoryEventPublisher()
    this.orderRepository = new CQRSOrderRepository(
      new MongoEventStoreOrderRepository(this.mongoConnection, () => UUIDV4()),
      eventPublisher
    )

    this.orderViewRepository = new CQRSOrderViewRepository(
      new MongoOrderViewRepository(this.mongoConnection)
    )

    this.orderViewRepository.listenTo(eventPublisher)
  }

  public createOrder(input: {
    createdBy: string
    takeOutId: string
  }): Promise<OrderId> {
    const createOrder = new CreateOrder({
        orderRepository: this.orderRepository,
        takeOutRepository:,
        eventPublisher
    })
  }
}
