"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var controller_1 = require("../controller/controller");
var validation_middleware_1 = require("../middlewares/validation-middleware");
var route = express_1.Router();
exports.authRoutes = route;
// https://ticketing.dev/api/signup
route.post('/signup', [
    express_validator_1.body('email').isEmail().withMessage('Valid email is required'),
    express_validator_1.body('username').notEmpty().withMessage('Username is required'),
    express_validator_1.body('password')
        .trim()
        .isLength({ min: 4, max: 9 })
        .withMessage('Valid password is required'),
    validation_middleware_1.validationMiddleware,
], controller_1.signUp);
// https://ticketing.dev/api/signin
route.post('/signin', [
    express_validator_1.body('email').isEmail().withMessage('Valid Email must be supply'),
    express_validator_1.body('password').trim().notEmpty().withMessage('Password must be supply'),
    validation_middleware_1.validationMiddleware,
], controller_1.signIn);
// https://ticketing.dev/api/users/signout
route.post('/signout', controller_1.signOut);
