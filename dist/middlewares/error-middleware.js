"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
var custom_error_1 = require("../errors/custom-error");
var errorMiddleware = function (err, _req, res, _next) {
    if (err instanceof custom_error_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    res.status(400).send({
        errors: [{ message: err.message || 'An unknown error occurred' }],
    });
};
exports.errorMiddleware = errorMiddleware;
