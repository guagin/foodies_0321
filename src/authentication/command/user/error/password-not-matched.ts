export class PasswordNotMatched extends Error {
    public alias = "PASS_WORD_NOT_MATCHED"
    constructor(message?: string) {
      super(message)
    }
  }
  