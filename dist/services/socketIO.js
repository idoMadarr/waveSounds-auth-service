"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectedClients = void 0;
var socket_io_1 = require("socket.io");
var io;
exports.connectedClients = {};
exports.default = {
    socketInit: function (server) {
        io = new socket_io_1.Server(server, { pingInterval: 2500, pingTimeout: 5000 });
        console.log('Socket Connected');
        io.on('connection', function (socket) {
            socket.on('auth', function (data) {
                var _a;
                for (var client in exports.connectedClients) {
                    var activeClient = exports.connectedClients[client].userId === data.user.id;
                    if (activeClient) {
                        io.to(client).emit('logout');
                    }
                }
                exports.connectedClients[socket.id] = {
                    userId: data.user.id,
                    username: data.user.username,
                    online: true,
                };
                socket.broadcast.emit('update-onlines', (_a = {
                        type: 'add'
                    },
                    _a[socket.id] = exports.connectedClients[socket.id],
                    _a));
            });
            socket.on('message', function (data) {
                io.to(data.recipient).emit('message', data);
            });
            socket.on('disconnect', function () {
                var _a;
                console.log('user disconnected');
                socket.broadcast.emit('update-onlines', (_a = {
                        type: 'remove'
                    },
                    _a[socket.id] = exports.connectedClients[socket.id],
                    _a));
                delete exports.connectedClients[socket.id];
            });
        });
    },
    getIO: function () {
        if (!io) {
            return console.log('Socket.io is not initialized!');
        }
        return io;
    },
};
