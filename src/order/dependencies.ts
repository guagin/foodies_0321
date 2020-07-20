import { Connection } from "mongoose"
import { DomainEventPublisher } from "event/domain-event-publisher"
import { TakeOutRepository } from "./command/domain/take-out/model/take-out-repository"
import { CQRSTakeOutViewRepository } from "./CQRS-repository/take-out/cqrs-take-out-view-repository"
import { MealRepository } from "./command/domain/meal/meal-repository"
import { CQRSMealViewRepository } from "./CQRS-repository/meal/cqrs-meal-view-repository"
import { OrderRepository } from "./command/domain/order/model/order-repository"
import { CQRSOrderViewRepository } from "./CQRS-repository/order/cqrs-order-view-repository"
import { ProviderRepository } from "./command/domain/provider/provider-repository"
import { CQRSProviderViewRepository } from "./CQRS-repository/provider/cqrs-provider-view-repository"
import { LocalRepositoryEventPublisher } from "./CQRS-repository/repository-event-publisher"
import { CQRSOrderRepository } from "./CQRS-repository/order/cqrs-order-repository"
import { MongoEventStoreOrderRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-order-repository"
import { MongoOrderViewRepository } from "./query/infrastructure/mongo-order-view-repository"
import { CQRSTakeOutRepository } from "./CQRS-repository/take-out/cqrs-take-out-repository"
import { MongoEventStoreTakeOutRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-take-out-repository"
import { MongoTakeOutViewRepository } from "./query/infrastructure/mongo-take-out-view-repository"
import { CQRSMealRepository } from "./CQRS-repository/meal/cqrs-meal-repository"
import { MongoEventStoreMealRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-meal-repository"
import { MongoMealViewRepository } from "./query/infrastructure/mongo-meal-view-repository"
import { CQRSProviderRepository } from "./CQRS-repository/provider/cqrs-provider-repository"
import { MongoEventStoreProviderRepository } from "./command/intrastructure/persistence/mongodb/mongo-event-store-provider-repository"
import { MongoProviderViewRepository } from "./query/infrastructure/mongo-provider-view-repository"
import { v4 as UUIDV4 } from "uuid"
import { OrderViewRepository } from "./query/domain/order/model/order-view-repository"
import { TakeOutViewRepository } from "./query/domain/take-out/take-out-view-repository"
import { MealViewRepository } from "./query/domain/meal/meal-view-repository"
import { ProviderViewRepository } from "./query/domain/provider/provider-view-repository"

export interface OrderDependencies {
  mongoConnection: Connection
  crossContextEventPublisher: DomainEventPublisher
  takeOutRepository: TakeOutRepository
  takeOutViewRepository: TakeOutViewRepository
  mealRepository: MealRepository
  mealViewRepository: MealViewRepository
  orderRepository: OrderRepository
  orderViewRepository: OrderViewRepository
  providerRepository: ProviderRepository
  providerViewRepository: ProviderViewRepository
}

function initOrderRepositories(
  mongoConnection: Connection
): {
  orderRepository: OrderRepository
  orderViewRepository: OrderViewRepository
} {
  const eventPublisher = new LocalRepositoryEventPublisher()
  const orderRepository = new CQRSOrderRepository(
    new MongoEventStoreOrderRepository(mongoConnection, () => UUIDV4()),
    eventPublisher
  )

  const orderViewRepository = new CQRSOrderViewRepository(
    new MongoOrderViewRepository(mongoConnection)
  )

  orderViewRepository.listenTo(eventPublisher)
  return {
    orderRepository,
    orderViewRepository
  }
}

function initTakeOutRepositories(
  mongoConnection: Connection
): {
  takeOutRepository: TakeOutRepository
  takeOutViewRepository: TakeOutViewRepository
} {
  const eventPublisher = new LocalRepositoryEventPublisher()
  const takeOutRepository = new CQRSTakeOutRepository(
    new MongoEventStoreTakeOutRepository(mongoConnection, async () => UUIDV4()),
    eventPublisher
  )

  const takeOutViewRepository = new CQRSTakeOutViewRepository(
    new MongoTakeOutViewRepository(mongoConnection)
  )

  takeOutViewRepository.listenTo(eventPublisher)
  return {
    takeOutRepository,
    takeOutViewRepository
  }
}

function initMealRepositories(
  mongoConnection: Connection
): {
  mealRepository: MealRepository
  mealViewRepository: MealViewRepository
} {
  const eventPublisher = new LocalRepositoryEventPublisher()
  const mealRepository = new CQRSMealRepository(
    new MongoEventStoreMealRepository(mongoConnection, () => UUIDV4()),
    eventPublisher
  )

  const mealViewRepository = new CQRSMealViewRepository(
    new MongoMealViewRepository(mongoConnection)
  )

  mealViewRepository.listenTo(eventPublisher)

  return {
    mealRepository,
    mealViewRepository
  }
}

function initProviderRepositories(
  mongoConnection: Connection
): {
  providerRepository: ProviderRepository
  providerViewRepository: ProviderViewRepository
} {
  const eventPublisher = new LocalRepositoryEventPublisher()
  const providerRepository = new CQRSProviderRepository(
    new MongoEventStoreProviderRepository(mongoConnection, () => UUIDV4()),
    eventPublisher
  )

  const providerViewRepository = new CQRSProviderViewRepository(
    new MongoProviderViewRepository(mongoConnection)
  )

  providerViewRepository.listenTo(eventPublisher)

  return {
    providerRepository,
    providerViewRepository
  }
}

export const makeOrderDependencies: (depends: {
  mongoConnection: Connection
  crossContextEventPublisher: DomainEventPublisher
}) => OrderDependencies = ({ mongoConnection, crossContextEventPublisher }) => {
  return {
    mongoConnection,
    crossContextEventPublisher,
    ...initOrderRepositories(mongoConnection),
    ...initTakeOutRepositories(mongoConnection),
    ...initMealRepositories(mongoConnection),
    ...initProviderRepositories(mongoConnection)
  }
}
