// Import the 'express' module, which helps create a web server easily
import express from 'express';
import { env } from './config/env.js';
import shortnerRoutes from './routes/shortner-routes.js';

const app = express();

// ===== MIDDLEWARE SETUP =====

// Serve static files from the 'public' folder
// Example: If 'public' has a file 'style.css', it can be accessed at 'http://localhost:PORT/style.css'
app.use(express.static('public'));

// Parse incoming form data (from HTML forms with POST method) into req.body
// 'extended: true' means it can parse nested objects in form data
app.use(express.urlencoded({ extended: true }));


// Set the template engine to 'ejs' so you can render dynamic HTML pages
app.set('view engine', 'ejs');

// Tell Express that all your EJS template files are stored inside the 'views' folder
app.set('views', 'views');

app.use('/', shortnerRoutes);

app.listen(env.PORT, () => console.log(`Server started at PORT: ${env.PORT}`));
