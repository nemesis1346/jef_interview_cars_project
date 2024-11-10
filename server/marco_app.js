// Import dependencies
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const router = require("./marco_routes");

// Setup logging
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Initialize app
const app = express();

// Environment configuration
if (process.env.NODE_ENV !== "production") {
  log("Loading environment variables for development...");
  require("dotenv").config({ path: "server/config/config.env" });
} else {
  log("Running in production mode...");
}

// Middleware setup
log("Setting up middleware...");
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
log("Setting up routes...");
app.use(router);

// Static file serving for production
if (process.env.NODE_ENV === "production") {
  log("Serving static files from 'frontend/build' directory...");
  const buildPath = path.join(__dirname, "/frontend/build");
  app.use(express.static(buildPath));

  // Handle all other routes by sending the 'index.html'
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  // In development, just show a basic message for the root route
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

// Error handling middleware
log("Setting up error handling middleware...");
app.use((err, req, res, next) => {
  log(`Error occurred: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Uncaught exceptions handler
process.on("uncaughtException", (err) => {
  log(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1); // Exit process after handling uncaught exceptions
});

// Unhandled promise rejections handler
process.on("unhandledRejection", (err) => {
  log(`Unhandled Promise Rejection: ${err.message}`);
  console.error(err.stack);
  process.exit(1); // Exit process after handling unhandled promise rejections
});

// Export app for server setup
module.exports = app;
