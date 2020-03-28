export class DomainEvent {
  name: string

  protected occuredAt: Date
  protected applicationVersion: string

  constructor(name: string, applicationVersion: string) {
    this.name = name
    this.applicationVersion = applicationVersion
    this.occuredAt = new Date()
  }
}
