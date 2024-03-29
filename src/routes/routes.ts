import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  signUp,
  signIn,
  googleOAuth,
  getFavorites,
  addFavorite,
  removeFavorites,
  signOut,
  getUsers,
  sendTopicPushNotification,
  sendDevicePushNotification,
} from '../controller/controller';
import { validationMiddleware } from '../middlewares/validation-middleware';
import { authMiddleware } from '../middlewares/auth-middleware';

const route = Router();

//  http://localhost:4000/ws-api/signup
route.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 9 })
      .withMessage('Valid password is required'),
    validationMiddleware,
  ],
  signUp
);

//  http://localhost:4000/ws-api/signin
route.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Valid Email must be supply'),
    body('password').trim().notEmpty().withMessage('Password must be supply'),
    validationMiddleware,
  ],
  signIn
);

// http://localhost:4000/ws-api/google-oauth
route.post(
  '/google-oauth',
  [
    body('email').isEmail().withMessage('Valid Email must be supply'),
    body('username').notEmpty().withMessage('Username must be supply'),
    validationMiddleware,
  ],
  googleOAuth
);

// http://localhost:4000/ws-api/favorites
route.get('/favorites', authMiddleware, getFavorites);

//  http://localhost:4000/ws-api/add-favorite
route.post(
  '/add-favorite',
  [
    authMiddleware,
    body('title').notEmpty().withMessage('Title must be supplied'),
    body('artist').notEmpty().withMessage('Artist must be supplied'),
    body('image').notEmpty().withMessage('Image must be supplied'),
    body('preview').notEmpty().withMessage('Preview must be supplied'),
    validationMiddleware,
  ],
  addFavorite
);

//  http://localhost:4000/ws-api/remove-favorite/:id
route.delete(
  '/remove-favorite/:id',
  [
    authMiddleware,
    param('id').exists().withMessage('Track ID is required'),
    validationMiddleware,
  ],
  removeFavorites
);

//  http://localhost:4000/ws-api/signout
route.post('/signout', signOut);

//  http://localhost:4000/ws-api/connected-users
route.get('/connected-users', [authMiddleware], getUsers);

//  http://localhost:4000/ws-api/push-notifications
route.get('/push-notifications-topic', sendTopicPushNotification);

//  http://localhost:4000/ws-api/push-notifications-device
route.post('/push-notifications-device', sendDevicePushNotification);

export { route as authRoutes };
