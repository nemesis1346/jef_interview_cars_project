const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const port = 3001;
const ERC20_ABI = require("../src/configs/abis/erc20.json");
const {
    ethers
} = require('ethers');

// Etherscan API key
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

app.use(cors());
app.use(express.json());



// Test route to check if the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

async function sendTokens() {
    // Ethereum provider (Sepolia in this case, but you can replace it with any provider)
    const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/2d93c5115ef6481693ef04e42f6bcba8");
    // console.log('Provider: ', provider)
    // Sender's private key (use securely) from METAMASK
    const senderPrivateKey = process.env.SENDER_PRIVATE_KEY;

    // ERC-20 contract address (replace with the actual address)
    const tokenAddress = process.env.TOKEN_ADDRESS; //USDT ether

    // Receiver's address and the amount to send
    const recipientAddress = process.env.RECIPIENT_ADDRESS;
    const amount = ethers.utils.parseUnits("0.001", 18);
    console.log('amount: ' + amount)

    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    // console.log('Wallet: ', wallet)

    // Connect to the ERC-20 token contract using the ABI
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
    // console.log('TokenContract: '+tokenContract)

    // Send the transaction
    const tx = await tokenContract.transfer(recipientAddress, amount);
    console.log("Transaction sent, waiting for confirmation...");

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.transactionHash);

    return receipt.transactionHash
}



app.post('/api/send_tokens', async (req, res) => {
    try {

        console.log('Received request at /api/marco_user', req.body);
        if (!req.body.data.walletAddress) {
            return res.status(400).json({
                message: 'Wallet address is required.'
            });
        }

        transaction = await sendTokens()

        res.json({
            message: 'Transaction successful',
            receipt: transaction
        });
    } catch (error) {
        console.error("Error sending tokens:", error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Define the /api/marco_user POST route
app.post('/api/marco_user', async (req, res) => {
    try {
        console.log('Received request at /api/marco_user', req.body);

        if (!req.body.data.walletAddress) {
            return res.status(400).json({
                message: 'Wallet address is required.'
            });
        }

        const {
            walletAddress
        } = req.body.data;


        // Etherscan API URL to fetch token balance
        const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api';
        const MODULE = 'account';
        const ACTION = 'balance';
        const ADDRESS = walletAddress;
        const TAG = 'latest';

        const url = `${ETHERSCAN_BASE_URL}?module=${MODULE}&action=${ACTION}&address=${ADDRESS}&tag=${TAG}&apikey=${ETHERSCAN_API_KEY}`;

        // Call the Etherscan API
        const response = await axios.get(url);
        if (response.data.status !== '1') {
            return res.status(500).json({
                message: 'Failed to fetch token data',
                error: response.data.result
            });
        }

        // Token balance in smallest unit (e.g., wei)
        const balance = response.data.result;

        console.log('balance of account: ', balance)

        res.json({
            message: 'Token data fetched successfully',
            data: {
                balance
            }
        });
    } catch (error) {
        console.error("Error fetching token data:", error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);


    // setTimeout(async () => {
    //     try {
    //         await sendTokens("0xB69c98D8bA0a5C2Fb33FC37d178DCD03Bcc79C2E");
    //     } catch (error) {
    //         console.error("Auto-triggered token send failed:", error.message);
    //     }
    // }, 1000); // Delay to ensure server is fully up
});

// Uncaught Exception handler
process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});

// Unhandled Promise Rejection handler
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Promise Rejection: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});