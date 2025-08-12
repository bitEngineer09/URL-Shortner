import {db} from '../config/db-client.js';


// Get all short links from the collection
export const loadLinks = async () => {
   const [rows] = await db.execute(`select * from short_links`);
   return rows;
};

// Save a new link document into the collection
export const saveLinks = async ({url, shortCode}) => {
    const [result] = await db.execute(`insert into short_links(short_code, url) values(?,?)`, [shortCode, url]);
    return result;
};

// Find a single link document by its shortCode
export const getLinkByShortCode = async (shortCode) => {
    const [rows] = await db.execute(`select * from short_links where short_code= ?`, [shortCode]);
    if (rows.length > 0) {
        return rows[0];
    } else {
        return null;
    }
};
