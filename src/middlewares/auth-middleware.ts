import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { verify } from 'jsonwebtoken';
import { DecodedPayload } from '../node-types/index';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.session) {
    throw new UnauthorizedError();
  }

  try {
    const decoded = verify(
      req.session.userJwt,
      process.env.JWT_KEY!
    ) as DecodedPayload;
    req.currentUser = decoded;
  } catch (error) {
    throw new UnauthorizedError();
  }

  next();
};
