import { RequestHandler, Request, Response } from 'express';
import { sign, JwtPayload } from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/User';
import { Favorite } from '../models/Favorite';
import { connectedClients } from '../services/socketIO';
import {
  subscribeTopic,
  unsubscribeTopic,
  sendToSubscriptions,
} from '../services/firebase';

export const signUp: RequestHandler = async (req, res, _next) => {
  const { email, username, password, fcmToken } = req.body;

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

  if (fcmToken) {
    subscribeTopic(fcmToken);
  }

  const response = { userJwt, user: createUser };
  res.status(200).send(response);
};

export const signIn: RequestHandler = async (req, res, next) => {
  const { email, password, fcmToken } = req.body;

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

  if (fcmToken) {
    subscribeTopic(fcmToken);
  }

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

export const signOut: RequestHandler = async (req, res, next) => {
  const { fcmToken } = req.body;

  if (fcmToken) {
    unsubscribeTopic(fcmToken);
  }

  req.session = { userJwt: null };
  res.send({ message: 'User signout successfully' });
};

export const getUsers: RequestHandler = (req, res, next) => {
  console.log(connectedClients, 'connectedClients');
  res.send(connectedClients);
};

export const sendTopicPushNotification: RequestHandler = async (
  req,
  res,
  _next
) => {
  const message = {
    notification: {
      title: 'Wavesounds - new update release!',
      body: 'Ido test!!!',
    },
    topic: 'all_users',
  };

  await sendToSubscriptions(message);

  res.send({});
};

export const sendDevicePushNotification: RequestHandler = async (
  req,
  res,
  next
) => {
  const { fcmToken } = req.body;

  const message = {
    notification: {
      title: 'Hello!',
      body: `Meet WaveSounds: the finest music player in town! 
             Elevate your musical journey with us - where every note resonates and every beat comes alive. 
             Best regards, @WaveSounds.`,
    },
    token: fcmToken,
  };

  await sendToSubscriptions(message);

  res.send({});
};
