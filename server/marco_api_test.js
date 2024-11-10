const express = require('express');
const app = express();
const port = 3000;


// Uncaught Exception handler to catch and log errors
process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    process.exit(1); // Exit process on uncaught exception
});

// Unhandled Promise Rejection handler to catch unhandled promise errors
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Promise Rejection: ${err.message}`);
    console.error(err.stack);
    if (server) {
        server.close(() => {
            process.exit(1); // Exit process on unhandled promise rejection
        });
    } else {
        process.exit(1); // If no server was started, just exit
    }
});


// Middleware to parse JSON request bodies
app.use(express.json());

// Test route to check if the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Define the /api/marco_user POST route
app.post('/api/marco_user', (req, res) => {
    console.log('Received request at /api/marco_user');
    console.log('Request body:', req.body); // Log the request body for debugging
    res.json({
        message: 'Success',
        data: req.body
    }); // Respond with success message
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});