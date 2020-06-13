import { DomainEvent } from "event/domain-event"

export class OrderCreated extends DomainEvent<{
  userId: string
  orderId: string
  products?: {
    id: string
    amount: number
    note?: string
  }[]
}> {
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
    super(OrderCreated.name, applicationVersion, payload)
  }
}

export class OrderAppended extends DomainEvent<{
  userId: string
  orderId: string
  takeOutId: string
}> {
  constructor(
    payload: {
      userId: string
      orderId: string
      takeOutId: string
    },
    applicationVersion: string
  ) {
    super(OrderAppended.name, applicationVersion, payload)
  }
}

export class OrderCanceled extends DomainEvent<{
  userId: string
  orderId: string
  products?: {
    id: string
    amount: number
    note?: string
  }[]
}> {
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
    super(OrderCanceled.name, applicationVersion, payload)
  }
}

export class OrderPlaced extends DomainEvent<{
  userId: string
  orderId: string
  products?: {
    id: string
    amount: number
    note?: string
  }[]
}> {
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
    super(OrderPlaced.name, applicationVersion, payload)
  }
}

export class ProductRemoved extends DomainEvent<{
  userId: string
  orderId: string
  products?: {
    id: string
    amount: number
    note?: string
  }[]
}> {
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
    super(ProductRemoved.name, applicationVersion, payload)
  }
}

export class ProductAppended extends DomainEvent<{
  userId: string
  orderId: string
  products?: {
    id: string
    amount: number
    note?: string
  }[]
}> {
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
    super(ProductAppended.name, applicationVersion, payload)
  }
}
