import { DomainEvent } from "domain-event"

export class ProductRemoved extends DomainEvent {
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
    super(ProductRemoved.name, applicationVersion)
  }
}

export class ProductAppended extends DomainEvent {
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
    super(ProductAppended.name, applicationVersion)
  }
}
