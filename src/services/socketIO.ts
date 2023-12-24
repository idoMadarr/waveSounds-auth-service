import { Server } from 'socket.io';
import client from './redis';

interface ConnectedOnlineType {
  id: string;
  email: string;
  username: string;
  socketId?: string;
}

export interface ChatMessageType {
  messageId: string;
  message: string;
  sender: string;
  recipient: string;
  timestamp: string;
  userA?: number;
  userB?: number;
  title?: string;
  artist?: string;
  image?: string;
  preview?: string;
}

let io: any;

export default {
  socketInit: (server: any) => {
    io = new Server(server, { pingInterval: 5000, pingTimeout: 5000 });
    console.log('Socket Connected');

    io.on('connection', (socket: any) => {
      socket.on('auth', async (data: ConnectedOnlineType) => {
        // Check if the user already in redis
        const user = await client.hGet('onlines', data.id);

        // Add the user to redis cache with "id" (mongodb's id) as a key
        // 'update' method should handle a case when the user close the app without disconnect
        const userData = { ...data, socketId: socket.id };
        await client.hSet('onlines', data.id, JSON.stringify(userData));
        socket.broadcast.emit('update-onlines', {
          type: user ? 'update' : 'add',
          user: userData,
        });
      });

      socket.on('message', (data: ChatMessageType) => {
        io.to(data.recipient).emit('message', data);
      });

      socket.on('logout', (user: ConnectedOnlineType) => {
        client.hDel('onlines', user.id);
        socket.broadcast.emit('update-onlines', {
          type: 'remove',
          user,
        });
      });

      socket.on('disconnect', async () => {
        const userOffline = (await client.hScan(
          'onlines',
          0,
          socket.id
        )) as any;
        const { cursor, tuples } = userOffline;

        for (const user of tuples) {
          const userObj = JSON.parse(user.value);
          if (userObj.socketId === socket.id) {
            client.hDel('onlines', userObj.id);
            socket.broadcast.emit('update-onlines', {
              type: 'remove',
              user: userObj,
            });
          }
        }
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
