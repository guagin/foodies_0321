export class DomainEvent<Payload> {
  name: string
  payload: Payload

  protected occuredAt: Date
  protected applicationVersion: string

  constructor(name: string, applicationVersion: string, payload: Payload) {
    this.name = name
    this.applicationVersion = applicationVersion
    this.payload = payload
    this.occuredAt = new Date()
  }
}
