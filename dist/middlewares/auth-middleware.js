"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var unauthorized_error_1 = require("../errors/unauthorized-error");
var authMiddleware = function (req, _res, next) {
    if (!req.currentUser) {
        throw new unauthorized_error_1.UnauthorizedError();
    }
    next();
};
exports.authMiddleware = authMiddleware;
