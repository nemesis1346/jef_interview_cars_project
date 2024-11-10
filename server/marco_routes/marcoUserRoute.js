// File: server/routes/metamaskRoutes.js

const express = require("express");

// Controller to handle the logic for this route
const { handleTransaction } = require("../controllers/metamaskController");

const router = express.Router();

// Route to handle sending Ether to the specified Metamask wallet address
router.route("/send-ether").post(handleTransaction);

module.exports = router;