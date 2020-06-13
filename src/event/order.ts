import { DomainEvent } from "domain-event"

export class OrderCreated extends DomainEvent {
  constructor(
    public payload: {
      userId: string
      orderId: string
      products?: {
        id: string
        amount: number
        note?: string
      }[]
    },
    applicationVersion: string
  ) {
    super(OrderCreated.name, applicationVersion)
  }
}

export class OrderAppended extends DomainEvent {
  constructor(
    public payload: {
      userId: string
      orderId: string
      takeOutId: string
    },
    applicationVersion: string
  ) {
    super(OrderAppended.name, applicationVersion)
  }
}

export class OrderCanceled extends DomainEvent {
  constructor(
    public payload: {
      userId: string
      orderId: string
      products?: {
        id: string
        amount: number
        note?: string
      }[]
    },
    applicationVersion: string
  ) {
    super(OrderCanceled.name, applicationVersion)
  }
}

export class OrderPlaced extends DomainEvent {
  constructor(
    payload: {
      userId: string
      orderId: string
      products?: {
        id: string
        amount: number
        note?: string
      }[]
    },
    applicationVersion: string
  ) {
    super(OrderPlaced.name, applicationVersion)
  }
}
