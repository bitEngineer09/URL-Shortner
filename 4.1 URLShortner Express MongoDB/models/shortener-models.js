import { dbClient } from '../config/db-client.js';
import { env } from '../config/env.js'; 


// Connect to the database using the client and DB name from .env
const db = dbClient.db(env.MONGODB_DATABASE_NAME);

// Choose the collection (like a table in SQL) to store short links
const shortnerCollection = db.collection('shortners');


// Get all short links from the collection
export const loadLinks = async () => {
    return shortnerCollection.find({}).toArray(); // find everything and return as an array
};

// Save a new link document into the collection
export const saveLinks = async (link) => {
    return shortnerCollection.insertOne(link);
};

// Find a single link document by its shortCode
export const getLinkByShortCode = async (shortCode) => {
    // this will return that particular doc containg that shortCode, from which we can access the url by .orperator
    return shortnerCollection.findOne({ shortCode: shortCode });
};
