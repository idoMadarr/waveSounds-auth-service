import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URI,
  //   url: process.env.REDIS_DEV_PORT,
});

client.connect();

client.on('error', error => console.log(`Redis Client Error`, error));

export default client;
