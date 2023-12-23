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
    io = new Server(server, { pingInterval: 25000, pingTimeout: 20000 });
    console.log('Socket Connected');

    io.on('connection', (socket: any) => {
      socket.on('auth', async (data: ConnectedOnlineType) => {
        // Check if the user already in redis
        const user = await client.hGet('onlines', data.id);

        // if no, add the user to redis cache with "id" (mongodb's id) as a key
        if (!user) {
          const userData = { ...data, socketId: socket.id };
          await client.hSet('onlines', data.id, JSON.stringify(userData));
          socket.broadcast.emit('update-onlines', {
            type: 'add',
            user: userData,
          });
        }
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

      socket.on('disconnect', () => {
        console.log('user disconnected');
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
