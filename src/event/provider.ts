import { DomainEvent } from "./domain-event"

const defaultApplicationVersion = process.env.applicationVersion || "0.0.0.1"

export class ProviderCreated extends DomainEvent<{
  id: string
  name: string
}> {
  constructor(
    payload: {
      id: string
      name: string
    },
    applicationVersion?: string
  ) {
    super(
      ProviderCreated.name,
      applicationVersion || defaultApplicationVersion,
      payload
    )
  }
}

export class ProviderNameChanged extends DomainEvent<{
  id: string
  name: string
}> {
  constructor(
    payload: {
      id: string
      name: string
    },
    applicationVersion?: string
  ) {
    super(
      ProviderNameChanged.name,
      applicationVersion || defaultApplicationVersion,
      payload
    )
  }
}

export class ProviderDesciptionChanged extends DomainEvent<{
  id: string
  description: string
}> {
  constructor(
    payload: {
      id: string
      description: string
    },
    applicationVersion?: string
  ) {
    super(
      ProviderDesciptionChanged.name,
      applicationVersion || defaultApplicationVersion,
      payload
    )
  }
}

export class ProviderPhoneChanged extends DomainEvent<{
  id: string
  phone: string
}> {
  constructor(
    payload: {
      id: string
      phone: string
    },
    applicationVersion?: string
  ) {
    super(
      ProviderPhoneChanged.name,
      applicationVersion || defaultApplicationVersion,
      payload
    )
  }
}
