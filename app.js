import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { PORT } from './env.js';
import crypto from 'crypto';  // Built-in module to generate random short codes

const app = express();   // Creating an instance of Express app


// ! Defining the path to the JSON file that will store the shortened URLs
const DATA_FILE = path.join('data', 'links.json');


// ! Function to load the existing links from links.json
const loadLinks = async () => {
    try {
        // Read the file as a UTF-8 text file
        const data = await fs.readFile(DATA_FILE, 'utf8');

        // If file is empty or contains only whitespace, return empty object
        if (!data.trim()) {
            return {};
        }

        // Convert JSON string from file into a JS object
        return JSON.parse(data);

    } catch (error) {
        // If file doesn't exist, create it with an empty object
        if (error.code === 'ENOENT') {
            await fs.writeFile(DATA_FILE, JSON.stringify({}));
            return {};
        }

        // If other error, throw it
        throw error;
    }
};


// ! Function to save links object to the JSON file
const saveLinks = async (links) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(links)); // Save the links as a JSON string
};


// ! Middleware setup
app.use(express.static('public'));            // Serve static files like CSS, JS from 'public' folder
app.use(express.urlencoded({ extended: true })); // Parse form data (application/x-www-form-urlencoded)
app.use(express.json());                      // Parse JSON body data (application/json)


// Route: Home page
app.get('/', async (req, res) => {
    try {
        // Read the HTML file from 'views' folder
        const file = await fs.readFile(path.join('views', 'index.html'));

        // Load saved short links from the file
        const links = await loadLinks();

        // Replace placeholder in HTML with generated links list
        /*
            * path.join('views', 'index.html'): Safely creates a full file path to the HTML file (OS-independent)
            * fs.readFile(...): Reads that HTML file asynchronously
            * file.toString(): Converts the file content (buffer) to a string
            * res.send(content): Sends that final HTML with inserted data (shortened URLs) to the browser
        */
        const content = file.toString().replaceAll(
            "{{ shortened_urls }}",  // Placeholder in HTML
            Object.entries(links).map(([shortCode, url]) =>
                // Create clickable link: short code and original URL
                `<a href='/${shortCode}' target='_blank'> ${req.get('host')}/${shortCode}</a> - ${url}`
            ).join('') // Join all links as a single HTML string
        );

        return res.send(content);   // Send the final HTML to the browser
    } catch (error) {
        console.log(error);        
        return res.status(500).send('Internal server error');
    }
});


// Route: Handle form submission for URL shortening
app.post('/', async (req, res) => {
    try {
        // Extract URL and optional shortCode from form data
        const { url, shortCode } = req.body;

        // If no custom shortCode, generate a random one
        const finalShortCode = shortCode || crypto.randomBytes(4).toString('hex');

        const links = await loadLinks();

        if (links[finalShortCode]) {
            return res.status(400).send('ShortCode already exists. Choose another');
        }

        // Save the new shortCode and its original URL
        links[finalShortCode] = url;

        // Write updated links to the file
        await saveLinks(links);

        // Redirect back to home page after successful submission
        res.redirect('/');

    } catch (error) {
        console.log(error);
    }
});


// Route: Redirect from shortCode to original URL
app.get('/:shortCode', async (req, res) => {
    try {
        // Extract shortCode from the route parameter
        const { shortCode } = req.params;

        const links = await loadLinks();

        if (!links[shortCode]) return res.status(404).send('404 error occurred');

        // Redirect to the original URL
        return res.redirect(links[shortCode]);

    } catch (error) {
        console.log(error);    
        res.status(500).send('Internal Server error');
    }
});


app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
