"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var redis_1 = require("redis");
exports.client = redis_1.createClient();
exports.client.on('error', function (error) { return console.log("Redis Client Error", error); });
