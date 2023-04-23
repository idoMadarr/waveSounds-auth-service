import { Server } from 'socket.io';

interface ClientsDatabaseType {
  [socketId: string]: ConnectedClientType;
}

interface ConnectedClientType {
  userId: number;
  username: string;
  online: boolean;
}

let io: any;
export let connectedClients: ClientsDatabaseType = {};

export default {
  socketInit: (server: any) => {
    io = new Server(server, { pingInterval: 2500, pingTimeout: 5000 });
    console.log('Socket Connected');

    io.on('connection', (socket: any) => {
      console.log(socket.id, 'socket.id');

      socket.on('auth', (data: any) => {
        for (let client in connectedClients) {
          const activeClient = connectedClients[client].userId === data.user.id;
          if (activeClient) {
            io.to(client).emit('logout');
          }
        }

        connectedClients[socket.id] = {
          userId: data.user.id,
          username: data.user.username,
          online: true,
        };

        socket.broadcast.emit('update-onlines', {
          type: 'add',
          [socket.id]: connectedClients[socket.id],
        });
      });

      socket.on('message', (data: any) => {
        io.to(data.recipient).emit('message', data);
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('update-onlines', {
          type: 'remove',
          [socket.id]: connectedClients[socket.id],
        });
        delete connectedClients[socket.id];
      });
    });
  },
  getIO: () => {
    if (!io) {
      return console.log('Socket.io is not initialized!');
    }
    return io;
  },
};
