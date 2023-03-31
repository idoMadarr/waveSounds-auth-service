"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var controller_1 = require("../controller/controller");
var validation_middleware_1 = require("../middlewares/validation-middleware");
var auth_middleware_1 = require("../middlewares/auth-middleware");
var route = express_1.Router();
exports.authRoutes = route;
//  http://localhost:4000/ws-api/signup
route.post('/signup', [
    express_validator_1.body('email').isEmail().withMessage('Valid email is required'),
    express_validator_1.body('username').notEmpty().withMessage('Username is required'),
    express_validator_1.body('password')
        .trim()
        .isLength({ min: 4, max: 9 })
        .withMessage('Valid password is required'),
    validation_middleware_1.validationMiddleware,
], controller_1.signUp);
//  http://localhost:4000/ws-api/signin
route.post('/signin', [
    express_validator_1.body('email').isEmail().withMessage('Valid Email must be supply'),
    express_validator_1.body('password').trim().notEmpty().withMessage('Password must be supply'),
    validation_middleware_1.validationMiddleware,
], controller_1.signIn);
// http://localhost:4000/ws-api/favorites
route.get('/favorites', auth_middleware_1.authMiddleware, controller_1.getFavorites);
//  http://localhost:4000/ws-api/add-favorite
route.post('/add-favorite', [
    auth_middleware_1.authMiddleware,
    express_validator_1.body('title').notEmpty().withMessage('Title must be supplied'),
    express_validator_1.body('artist').notEmpty().withMessage('Artist must be supplied'),
    express_validator_1.body('rank').notEmpty().withMessage('Rank must be supplied'),
    express_validator_1.body('image').notEmpty().withMessage('Image must be supplied'),
    express_validator_1.body('preview').notEmpty().withMessage('Preview must be supplied'),
    validation_middleware_1.validationMiddleware,
], controller_1.addFavorite);
//  http://localhost:4000/ws-api/signout
route.post('/signout', controller_1.signOut);
