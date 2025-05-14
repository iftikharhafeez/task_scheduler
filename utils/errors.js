class ES6Error extends Error {
  constructor(message, status = 500) {
      super(message);

      Error.captureStackTrace(this, this.constructor);

      this.name = this.constructor.name;
      this.code = this.constructor.code;
      this.statusCode = status;
  }
}

class InvalidChatType extends ES6Error {}

export default {
  InvalidChatType
};
