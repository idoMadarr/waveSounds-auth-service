import { RequestHandler, Request, Response } from 'express';
import { sign, JwtPayload } from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/User';
import { Favorite } from '../models/Favorite';

export const signUp: RequestHandler = async (req, res, _next) => {
  const { email, username, password } = req.body;

  const existUser = await User.find({ email });

  if (existUser.length) {
    throw new BadRequestError('Email in use');
  }

  const hashingPassword = await User.toHash(password);
  const createUser = User.build({ email, username, password: hashingPassword });
  await createUser.save();
  Favorite.buildRepo(createUser.id);

  const payload: JwtPayload = {
    id: createUser.id,
    email: createUser.email,
  };
  const userJwt = sign(payload, process.env.JWT_KEY!);
  req.session = { userJwt };

  const response = { userJwt, createUser };
  res.status(200).send(response);
};

export const signIn: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordMatch = await User.toCompare(password, existUser.password);
  if (!passwordMatch) {
    throw new BadRequestError('Invalid password, please try again');
  }

  const payload: JwtPayload = { id: existUser.id, email: existUser.email };
  const userJwt = sign(payload, process.env.JWT_KEY!);
  req.session = { userJwt };

  const response = { userJwt, existUser };
  res.status(200).send(response);
};

export const addFavorite = async (req: Request, res: Response) => {
  const favoriteCredentials = {
    user: req.currentUser.id,
    track: { ...req.body },
  };

  const newFavorite = await Favorite.addFavorite(favoriteCredentials);

  if (!newFavorite) {
    throw new BadRequestError('Favorite already exists');
  }

  res.send(newFavorite);
};

export const getFavorites = async (req: Request, res: Response) => {
  const userFavories = await Favorite.findOne({ user: req.currentUser.id });

  res.send(userFavories?.repo);
};

export const signOut: RequestHandler = (req, res, next) => {
  req.session = { userJwt: null };
  res.send({});
};
