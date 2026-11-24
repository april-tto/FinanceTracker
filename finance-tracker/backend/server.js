require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    Configuration,
    PlaidApi,
    PlaidEnvironments,
    Products,
    CountryCode,
} = require("plaid");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(configuration);

let accessToken = null;

app.post("/api/create_link_token", async (req, res) => {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: {
                client_user_id: "prototype-user",
            },
            client_name: "Finance Tracker",
            products: [Products.Auth, Products.Transactions],
            country_codes: [CountryCode.Ca],
            language: "en",
        });

        res.json(response.data);
    } catch (error) {
        console.error(error.response?.data || error);
        res.status(500).json({ error: "Failed to create link token" });
    }
})

app.post("/api/exchange_public_token", async (req, res) => {
    try {
        const { public_token } = req.body;
        if (!public_token) {
            return res.status(400).json({
                error: "Missing public_token"
            });
        }
        const response = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        accessToken = response.data.access_token;
        console.log("Plaid token exchange successful!");
        res.json({ success: true });

    } catch (error) {
        console.error(
            "Plaid exchange error:",
            error.response?.data || error.message || error
        );

        res.status(500).json({
            error: error.response?.data?.error_message ||
                "Token exchange failed"
        });
    }
});

app.get("/api/accounts", async (req, res) => {
    try {
        if (!accessToken) {
            return res.status(400).json({ error: "No connected account" });
        }
        console.log("Fetching accounts...");

        const response = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        console.log("Accounts retrieved successfully!");

        res.json(response.data.accounts);

    } catch (error) {
        console.error("PLAID ACCOUNTS ERROR:");
        console.error(error.response?.data || error.message || error);

        res.status(500).json({
            error: error.response?.data?.error_message ||
                error.message ||
                "Accounts retrieval failed"
        });
    }
});

const endDate = new Date();
const startDate = new Date();

startDate.setDate(startDate.getDate() - 30);

const formatDate = (date) =>
    date.toISOString().split("T")[0];


app.get("/api/transactions", async (req, res) => {
    try {
        console.log("Fetching transactions...");

        if (!accessToken) {
            return res.status(400).json({
                error: "No connected account"
            });}

            const response = await plaidClient.transactionsGet({
                access_token: accessToken,
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
            });

            console.log("Transactions retrieved successfully!");

            res.json(response.data.transactions);

        } catch (error) {
            console.error("PLAID TRANSACTION ERROR:");
            console.error(error.response?.data || error.message || error);

            res.status(500).json({
                error: error.response?.data?.error_message ||
                    error.message ||
                    "Transaction retrieval failed"
            });
        }
    });

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});