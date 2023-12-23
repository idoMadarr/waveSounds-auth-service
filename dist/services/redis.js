"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = require("redis");
var client = redis_1.createClient({
    url: process.env.REDIS_URI,
    //   url: process.env.REDIS_DEV_PORT,
});
client.connect();
client.on('error', function (error) { return console.log("Redis Client Error", error); });
exports.default = client;
