import { Connection } from "mongoose"

import { DomainEventPublisher } from "domain-event-publisher"
import { CreateOrder } from "./command/application/order/create-order"
import { CQRSOrderRepository } from "./CQRS-repository/order/cqrs-order-repository"
import { CQRSOrderViewRepository } from "./CQRS-repository/order/cqrs-order-view-repository"
import { MongoEventStoreOrderRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-order-repository"
import { v4 as UUIDV4 } from "uuid"
import moment from "moment"

import { MongoOrderViewRepository } from "./query/infrastructure/mongo-order-view-repository"
import { CQRSTakeOutRepository } from "./CQRS-repository/take-out/cqrs-take-out-repository"
import { CQRSTakeOutViewRepository } from "./CQRS-repository/take-out/cqrs-take-out-view-repository"
import { CQRSMealRepository } from "./CQRS-repository/meal/cqrs-meal-repository"
import { MongoEventStoreTakeOutRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-take-out-repository"
import { MongoTakeOutViewRepository } from "./query/infrastructure/mongo-take-out-view-repository"
import { TakeOutRepository } from "./command/domain/take-out/model/take-out-repository"
import { OrderRepository } from "./command/domain/order/model/order-repository"
import { MongoEventStoreMealRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-meal-repository"
import { CQRSMealViewRepository } from "./CQRS-repository/meal/cqrs-meal-view-repository"
import { MongoMealViewRepository } from "./query/infrastructure/mongo-meal-view-repository"
import { LocalRepositoryEventPublisher } from "./CQRS-repository/repository-event-publisher"
import { MealRepository } from "./command/domain/meal/meal-repository"
import { OrderView } from "./query/domain/order/model/order-view"
import { OrderViewOfId } from "./query/application/order/of-id"
import { CreateTakeOut } from "./command/application/take-out/create-take-out"
import { TakeOutView } from "./query/domain/take-out/model/take-out-view"
import { TakeOutViewOfId } from "./query/application/take-out/of-id"
import { AppendProduct } from "./command/application/order/append-product"
import { RemoveProduct } from "./command/application/order/remove-product"
import { MealId } from "./command/domain/meal/meal"
import { CreateMeal } from "./command/application/meal/create-meal"
import { MealView } from "./query/domain/meal/meal-view"
import { MealViewOfIdUseCase } from "./query/application/meal/of-id"
import { LaunchMeal } from "./command/application/meal/launch-meal"
import { PrepareMeal } from "./command/application/meal/prepare-meal"
import { ShelveMeal } from "./command/application/meal/shelve-meal"
import { TakeOutViewOfUserId } from "./query/application/take-out/of-user-id"
import { MealViewsOfPage } from "./query/application/meal/of-page"

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
    startedAt: string
    endAt: string
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
      startedAt: moment(startedAt).toDate(),
      endAt: moment(endAt).toDate()
    })

    return takeOutId.toValue()
  }

  public async takeOutOfId(input: { takeOutId: string }): Promise<TakeOutView> {
    const { takeOutId } = input
    const takeOutOfId = new TakeOutViewOfId(this.takeOutViewRepository)
    return takeOutOfId.ofId(takeOutId)
  }

  public async takeOutOfUserId(input: {
    userId: string
  }): Promise<TakeOutView[]> {
    const { userId } = input
    const takeOutOfUserId = new TakeOutViewOfUserId(this.takeOutViewRepository)
    return takeOutOfUserId.ofUserId(userId)
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

  public async orderOfId(id: string): Promise<OrderView> {
    const orderOfId = new OrderViewOfId(this.orderViewRepository)
    return orderOfId.ofId(id)
  }

  public async appendProduct(input: {
    products: {
      id: string
      amount: number
    }[]
    orderId: string
  }): Promise<void> {
    const appendProduct = new AppendProduct({
      orderRepository: this.orderRepository,
      eventPublisher: this.crossContextEventPublisher
    })

    const { products, orderId } = input

    return appendProduct.append(products).to(orderId)
  }

  public async removeProduct(input: {
    orderId: string
    products: {
      id: string
      amount: number
    }[]
  }): Promise<void> {
    const { orderId, products } = input
    const removeProduct = new RemoveProduct({
      orderRepository: this.orderRepository,
      eventPublisher: this.crossContextEventPublisher
    })

    removeProduct.remove(products).from(orderId)
  }

  public async createMeals(input: {
    meals: {
      name: string
      price: number
      description: string
      pictures: string[]
      provider: string
    }[]
    createdBy: string
  }): Promise<string[]> {
    const createMeal = new CreateMeal(
      this.mealRepository,
      this.crossContextEventPublisher
    )

    const { meals, createdBy } = input

    const promiseToCreateMeals: Promise<MealId>[] = []
    meals.forEach(meal => {
      promiseToCreateMeals.push(createMeal.create({ ...meal, createdBy }))
    })

    const mealIds = await Promise.all(promiseToCreateMeals)

    return mealIds.map(mealId => mealId.toValue())
  }

  public async mealOfId(input: { mealId: string }): Promise<MealView> {
    const { mealId } = input
    const mealOfId = new MealViewOfIdUseCase(this.mealViewRepository)
    return mealOfId.ofId(mealId)
  }

  public async launchMeal(input: { mealId: string }): Promise<void> {
    const { mealId } = input
    const launchMeal = new LaunchMeal(
      this.mealRepository,
      this.crossContextEventPublisher
    )

    await launchMeal.launch(mealId)
  }

  public async prepareMeal(input: { mealId: string }): Promise<void> {
    const { mealId } = input
    const prepareMeal = new PrepareMeal(
      this.mealRepository,
      this.crossContextEventPublisher
    )

    await prepareMeal.prepare(mealId)
  }

  public async shelveMeal(input: { mealId: string }): Promise<void> {
    const { mealId } = input
    const shelveMeal = new ShelveMeal(
      this.mealRepository,
      this.crossContextEventPublisher
    )

    await shelveMeal.shelve(mealId)
  }

  public async mealOfPage({
    page
  }: {
    page: number
  }): Promise<{
    meals: MealView[]
    hasNext: boolean
    hasPrevious: boolean
    totalPages: number
    page: number
  }> {
    const mealsOfPage = new MealViewsOfPage(this.mealViewRepository)

    return mealsOfPage.ofPage({ page })
  }
}
