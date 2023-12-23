import { createClient } from 'redis';

const client = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
    tls: true,
  },
});

client.connect();

client.on('error', error => console.log(`Redis Client Error`, error));

export default client;
