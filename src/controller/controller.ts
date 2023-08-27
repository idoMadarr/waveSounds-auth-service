import { RequestHandler, Request, Response } from 'express';
import { sign, JwtPayload } from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/User';
import { Favorite } from '../models/Favorite';
import { connectedClients } from '../services/socketIO';
import { firebaseRoot } from '../services/firebase';

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

  const response = { userJwt, user: createUser };
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

  const response = { userJwt, user: existUser };
  res.status(200).send(response);
};

export const googleOAuth: RequestHandler = async (req, res, next) => {
  const { email, username } = req.body;

  const existUser = await User.findOne({ email });
  if (existUser) {
    const payload: JwtPayload = { id: existUser._id, email: existUser.email };
    const userJwt = sign(payload, process.env.JWT_KEY!);
    req.session = { userJwt };

    const response = { userJwt, user: existUser };
    return res.status(200).send(response);
  }

  const password = await User.toHash('oauth_pass');
  const createUser = User.build({ email, username, password });
  await createUser.save();
  Favorite.buildRepo(createUser.id);

  const payload: JwtPayload = {
    id: createUser.id,
    email: createUser.email,
  };
  const userJwt = sign(payload, process.env.JWT_KEY!);
  req.session = { userJwt };

  const response = { userJwt, user: createUser };
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

export const removeFavorites = async (req: Request, res: Response) => {
  const favoriteId = req.params.id;

  const favorite = await Favorite.deleteFavorite(
    req.currentUser.id,
    favoriteId
  );

  if (!favorite) {
    throw new BadRequestError('Invalid credentials');
  }

  res.send(favorite);
};

export const signOut: RequestHandler = (req, res, next) => {
  req.session = { userJwt: null };
  res.send({});
};

export const getUsers: RequestHandler = (req, res, next) => {
  console.log(connectedClients, 'connectedClients');
  res.send(connectedClients);
};

export const sendPushNotification: RequestHandler = (req, res, next) => {
  const registrationToken = req.body.registrationToken;

  const message = {
    notification: {
      title: 'Notification Title',
      body: 'Notification Body',
    },
    token: registrationToken,
  };

  firebaseRoot
    .messaging()
    .send(message)
    .then((response: any) => {
      res.send('Successfully sent message:');
      console.log('Successfully sent message:', response);
    })
    .catch((error: any) => {
      console.log('Error sending message:', error);
      res.send('Failed to sent message:');
    });
};
