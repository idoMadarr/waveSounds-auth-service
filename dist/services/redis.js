"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = require("redis");
// Production:
var client = (0, redis_1.createClient)({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 6379,
        tls: true,
    },
});
// Dev:
// const client = createClient();
client.connect();
client.on('error', function (error) { return console.log("Redis Client Error", error); });
exports.default = client;
