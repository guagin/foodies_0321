export class DomainError {
  message: string
  payload: any
  constructor({ message, payload }: { message: string; payload: any }) {
    this.message = message
    this.payload = payload
  }
}
