import { createClient } from 'redis';

const client = createClient();

client.connect();

client.on('error', error => console.log(`Redis Client Error`, error));

export default client;
