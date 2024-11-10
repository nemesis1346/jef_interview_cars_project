const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// Etherscan API key
const ETHERSCAN_API_KEY = 'VHJTEVK9WXXCPHTZMG6HUTM71HM1EINAMK';

// Use CORS middleware with default settings
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

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

// Test route to check if the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
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
});