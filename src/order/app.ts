import { Connection } from "mongoose"

import { DomainEventPublisher } from "domain-event-publisher"
import { CreateOrder } from "./command/application/order/create-order"
import { CQRSOrderRepository } from "./CQRS-repository/order/cqrs-order-repository"
import { CQRSOrderViewRepository } from "./CQRS-repository/order/cqrs-order-view-repository"
import { MongoEventStoreOrderRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-order-repository"
import { v4 as UUIDV4 } from "uuid"

import { MongoOrderViewRepository } from "./query/infrastructure/mongo-order-view-repository"
import { CQRSTakeOutRepository } from "./CQRS-repository/take-out/cqrs-take-out-repository"
import { CQRSTakeOutViewRepository } from "./CQRS-repository/take-out/cqrs-take-out-view-repository"
import { CQRSMealRepository } from "./CQRS-repository/meal/cqrs-meal-repository"
import { MongoEventStoreTakeOutRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-take-out-repository"
import { MongoTakeOutViewRepository } from "./query/infrastructure/mongo-take-out-view-repository"
import { TakeOutRepository } from "./command/domain/take-out/model/take-out-repository"
import { MealViewRepository } from "./query/domain/meal/meal-view-repository"
import { OrderRepository } from "./command/domain/order/model/order-repository"
import { MongoEventStoreMealRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-meal-repository"
import { CQRSMealViewRepository } from "./CQRS-repository/meal/cqrs-meal-view-repository"
import { MongoMealViewRepository } from "./query/infrastructure/mongo-meal-view-repository"
import { LocalRepositoryEventPublisher } from "./CQRS-repository/repository-event-publisher"
import { MealRepository } from "./command/domain/meal/meal-repository"
import { OrderView } from "./query/domain/order/model/order-view"
import { OrderViewOfId } from "./query/application/order/of-id"
import { CreateTakeOut } from "./command/application/take-out/create-take-out"

export class App {
  private mongoConnection: Connection
  private crossContextEventPublisher: DomainEventPublisher
  private takeOutRepository: TakeOutRepository
  private takeOutViewRepository: CQRSTakeOutViewRepository
  private mealRepository: MealRepository
  private mealViewRepository: CQRSMealViewRepository
  private orderRepository: OrderRepository
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
    this.initOrderRepositories()
    this.initTakeOutRepositories()
    this.initMealRepositories()
  }

  private initOrderRepositories(): void {
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

  private initTakeOutRepositories(): void {
    const eventPublisher = new LocalRepositoryEventPublisher()
    this.takeOutRepository = new CQRSTakeOutRepository(
      new MongoEventStoreTakeOutRepository(this.mongoConnection, async () =>
        UUIDV4()
      ),
      eventPublisher
    )

    this.takeOutViewRepository = new CQRSTakeOutViewRepository(
      new MongoTakeOutViewRepository(this.mongoConnection)
    )

    this.takeOutViewRepository.listenTo(eventPublisher)
  }

  private initMealRepositories(): void {
    const eventPublisher = new LocalRepositoryEventPublisher()
    this.mealRepository = new CQRSMealRepository(
      new MongoEventStoreMealRepository(this.mongoConnection, () => UUIDV4()),
      eventPublisher
    )

    this.mealViewRepository = new CQRSMealViewRepository(
      new MongoMealViewRepository(this.mongoConnection)
    )

    this.mealViewRepository.listenTo(eventPublisher)
  }

  public async createTakeOut(input: {
    createdBy: string
    title: string
    description: string
    startedAt: Date
    endAt: Date
  }): Promise<string> {
    const { createdBy, title, description, startedAt, endAt } = input

    const createTakeOut = new CreateTakeOut(
      this.takeOutRepository,
      this.crossContextEventPublisher
    )

    const takeOutId = await createTakeOut.create({
      createdBy,
      title,
      description,
      startedAt,
      endAt
    })

    return takeOutId.toValue()
  }

  public async createOrder(input: {
    createdBy: string
    takeOutId: string
  }): Promise<string> {
    const { createdBy, takeOutId } = input

    const createOrder = new CreateOrder({
      orderRepository: this.orderRepository,
      takeOutRepository: this.takeOutRepository,
      eventPublisher: this.crossContextEventPublisher
    })

    return (await createOrder.createBy(createdBy).appendTo(takeOutId)).toValue()
  }

  public async OrderOfId(id: string): Promise<OrderView> {
    const orderOfId = new OrderViewOfId(this.orderViewRepository)
    return orderOfId.ofId(id)
  }
}
