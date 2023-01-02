import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super();
    this.errors = errors;

    // This line is required only beacuse we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(error => ({
      message: error.msg,
      field: error.param,
    }));
  }
}
