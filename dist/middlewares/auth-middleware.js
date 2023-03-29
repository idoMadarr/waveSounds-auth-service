"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var unauthorized_error_1 = require("../errors/unauthorized-error");
var jsonwebtoken_1 = require("jsonwebtoken");
var authMiddleware = function (req, _res, next) {
    if (!req.session) {
        throw new unauthorized_error_1.UnauthorizedError();
    }
    try {
        var decoded = jsonwebtoken_1.verify(req.session.userJwt, process.env.JWT_KEY);
        req.currentUser = decoded;
    }
    catch (error) {
        throw new unauthorized_error_1.UnauthorizedError();
    }
    next();
};
exports.authMiddleware = authMiddleware;
