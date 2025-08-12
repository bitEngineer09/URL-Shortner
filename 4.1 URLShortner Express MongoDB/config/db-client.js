import { MongoClient } from 'mongodb';
import { env } from './env.js';

// * create instance
export const dbClient = new MongoClient(env.MONGODB_URI);  

await dbClient.connect();

console.log('connected to MongoDB');