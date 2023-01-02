import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;
  message: string;

  constructor(message: string) {
    super();
    this.message = message;

    // This line is required only beacuse we are extending a built-in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
