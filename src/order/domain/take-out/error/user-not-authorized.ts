export class ActivityNotAvailable extends Error {
    public alias = "ACTIVITY_NOT_AVAILABLE"
    constructor(message?: string) {
      super(message)
    }
  }
  