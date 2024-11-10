// File: server/controllers/metamaskController.js

const axios = require("axios");  // Assuming you might need Axios for external calls

// Controller function to handle the sending of Ether
exports.handleTransaction = async (req, res) => {
  try {
    const { metamask_wallet, amount } = req.body;

    // Check if the required fields are provided
    if (!metamask_wallet || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide both the wallet address and the amount of Ether."
      });
    }

    // Validation (optional): check if the wallet address is in a valid format
    if (!isValidWalletAddress(metamask_wallet)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wallet address format."
      });
    }

    // You can replace this with actual logic to send Ether to the wallet
    // Placeholder for now
    const transactionResult = await sendEtherToWallet(metamask_wallet, amount);

    return res.status(200).json({
      success: true,
      message: "Ether sent successfully.",
      transactionDetails: transactionResult,
    });

  } catch (error) {
    console.error("Error handling the transaction:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

// Function to validate wallet address (simple check, can be expanded based on your needs)
const isValidWalletAddress = (address) => {
  const regex = /^0x[a-fA-F0-9]{40}$/; // Basic Ethereum address format check
  return regex.test(address);
};

// Function to simulate sending Ether to the wallet
// You should replace this with actual logic to interact with Ethereum (via web3.js or ethers.js)
const sendEtherToWallet = async (wallet, amount) => {
  // This is a placeholder; replace with actual logic (e.g., using web3.js or ethers.js)
  console.log(`Sending ${amount} Ether to ${wallet}`);

  // Simulate a transaction result
  return {
    wallet,
    amount,
    transactionHash: "0x123456789abcdef",
    status: "success",
  };
};
