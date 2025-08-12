// Import Node's built-in crypto module to generate random short codes
import crypto from 'crypto';
import { loadLinks, saveLinks, getLinkByShortCode } from '../models/shortener-models.js';


// Controller to show the home page
export const getShortnerPage = async (req, res) => {
    try {
        // Get all shortened links from the database
        const linksArr = await loadLinks();

        // Create an object where keys = shortCode, values = original URLs
        const links = {};
        linksArr.forEach(link => {
            links[link.short_code] = link.url;
        });

        // Render 'index.ejs' and pass the links + host name to the view
        return res.render('index.ejs', { links, hosts: req.get('host') })

    } catch (error) {
        // Log any error and send a server error response
        console.log(error);        
        return res.status(500).send('Internal server error');
    }
}



// Controller to handle creating a new short link
export const postURLShortner = async (req, res) => {
    try {
        // Read URL and optional custom shortCode from form data
        const { url, shortCode } = req.body;

        // If no shortCode is given, make a random one (8 hex characters)
        const finalShortCode = shortCode || crypto.randomBytes(4).toString('hex');

        // Check if this shortCode is already used
        const existingLink = await getLinkByShortCode(finalShortCode);
        if (existingLink) return res.status(400).send('Shortcode already exists. Choose another.');

        // Save new link in DB
        await saveLinks({ url, shortCode: finalShortCode });

        // Redirect to the home page so the user sees the updated list
        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}



// Controller to redirect short links to their original URLs
export const redirectToShortLink = async (req, res) => {
    try {
        // Get the shortCode from the URL path
        const { shortCode } = req.params;

        // Find the link in the DB
        const link = await getLinkByShortCode(shortCode);

        // If not found, send user to a 404 page
        if (!link) return res.redirect('/404');

        // If found, redirect user to the original URL
        return res.redirect(link.url);

    } catch (error) {
        console.log(error);    
        res.status(500).send('Internal Server error');
    }
}
