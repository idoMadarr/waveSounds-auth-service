import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: err.message || 'An unknown error occurred' }],
  });
};
