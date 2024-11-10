console.log("Starting server...");

const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
const PORT = process.env.PORT || 3099;

console.log('Debugging')

// A function to ensure required environment variables are set
const checkEnvVariables = () => {
  const requiredEnvVars = [
    "CLOUDINARY_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.error(`Error: Missing required environment variable: ${envVar}`);
      process.exit(1); // Exit if a required env variable is missing
    }
  });
};

// Check if the necessary environment variables are available
checkEnvVariables();

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

// Set up Cloudinary configuration with environment variables
console.log("Setting up Cloudinary...");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start the server and handle possible errors
let server;
try {
  console.log(`Attempting to start the server on port ${PORT}...`);
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error("Error starting the server:", err.message);
  console.error(err.stack); // Log the full stack trace
}

// To help debug and ensure the database connection is working (if needed):
// Uncomment this if you have a database connection setup.
// try {
//   console.log("Connecting to the database...");
//   connectDatabase();
// } catch (err) {
//   console.error("Error connecting to the database:", err.message);
//   process.exit(1); // Exit the process if the database connection fails
// }
