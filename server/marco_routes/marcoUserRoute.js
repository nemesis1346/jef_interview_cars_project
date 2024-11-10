const express = require("express");
const router = express.Router();

// Handle Send Ether request
router.post("/api/marco_user", async (req, res) => {
  try {
    // Log the received data
    const { chainId, account, message } = req.body.data;

    console.log("Received data from frontend:", { chainId, account, message });

    // Here you would normally have logic to send Ether using the blockchain provider
    // For now, we'll just send a dummy success response.

    res.status(200).json({ success: true, message: "Ether sent successfully!" });

  } catch (error) {
    console.error("Error handling /api/marco_user request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
