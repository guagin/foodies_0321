export class TakeOutNotFound extends Error {
    public alias = "TAKE_OUT_NOT_FOUND"
    constructor(message?: string) {
      super(message)
    }
  }
  