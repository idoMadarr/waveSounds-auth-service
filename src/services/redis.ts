import { createClient } from 'redis';

export const client = createClient();

client.on('error', error => console.log(`Redis Client Error`, error));
