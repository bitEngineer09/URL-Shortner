// Import the 'express' module to create routes
import express from 'express';

// Import functions (controllers) that handle what happens for each route
// Each function here is responsible for responding to a request
import { getShortnerPage, postURLShortner, redirectToShortLink } from '../controllers/shortner-controller.js';


// Create a router object
// This 'router' works like a mini Express app for handling specific routes
const router = express.Router();


// When someone visits the root URL '/' with a GET request,
// run the getShortnerPage function (probably shows the home page or form)
router.get('/', getShortnerPage);


// When someone sends a POST request to '/',
// run the postURLShortner function (probably saves the shortened URL)
router.post('/', postURLShortner);


// When someone visits '/something' (e.g., '/abc123'),
// ':shortCode' is a placeholder for the actual code in the URL
// The redirectToShortLink function will handle redirecting to the original URL
router.get('/:shortCode', redirectToShortLink);


// Export the router so it can be used in the main app file
export default router;
