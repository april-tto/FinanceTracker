"use client"
import { useEffect, useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import "./PlaidConnect.css";

interface Account {
    account_id: string;
    name: string;
    official_name: string | null;
    type: string;
    subtype: string | null;
    balances: {
        current: number | null;
        available: number | null;
        iso_currency_code: string | null;
    };
}

interface Transaction {
    transaction_id: string;
    name: string;
    date: string;
    amount: number;
    iso_currency_code: string | null;
}

function PlaidConnect() {
    const [linkToken, setLinkToken] = useState(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/create_link_token", {
            method: "POST",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Could not create Link token");
                return res.json();
            })
            .then((data) => setLinkToken(data.link_token))
            .catch((error) => setError(error.message));
    }, []);


    const onSuccess = useCallback(async (publicToken: string | null) => {
        setLoading(true);
        setError("");
        try {
            const exchangeRes = await fetch(
                "http://localhost:8000/api/exchange_public_token",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ public_token: publicToken }),
                }
            );

            if (!exchangeRes.ok) {
                const errorData = await exchangeRes.json();

                throw new Error(
                    errorData.error || "Could not exchange public token"
                );
            }

            const [accountsRes, transactionsRes] = await Promise.all([
                fetch("http://localhost:8000/api/accounts"),
                fetch("http://localhost:8000/api/transactions"),
            ]);

            const accountsData = await accountsRes.json();
            const transactionsData = await transactionsRes.json();

            console.log("Accounts:", accountsData);
            console.log("Transactions:", transactionsData);

            console.log("Accounts is array:", Array.isArray(accountsData));
            console.log("Transactions is array:", Array.isArray(transactionsData));

            if (!accountsRes.ok) {
                throw new Error(
                    "Accounts error: " + JSON.stringify(accountsData)
                );
            }

            if (!transactionsRes.ok) {
                throw new Error(
                    "Transactions error: " + JSON.stringify(transactionsData)
                );
            }

            setAccounts(accountsData);
            setTransactions(transactionsData);


        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }, []);


    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess,
    });


    return (
    <div className="plaid-container">
        <div className="plaid-header">
            <h2>Connect your bank</h2>
            <p>Securely connect your account to view your finances.</p>

            <button
                className="connect-button"
                onClick={() => open()}
                disabled={!ready}
            >
                Connect Bank Account
            </button>
        </div>

        {loading && <p className="loading-message">Loading bank data...</p>}

        {error && <p className="error-message">{error}</p>}

        {accounts.length > 0 && (
            <section className="plaid-section">
                <h2>Accounts</h2>

                <div className="accounts-grid">
                    {accounts.map((account) => (
                        <div className="account-card" key={account.account_id}>
                            <h3>{account.name}</h3>

                            <p className="account-type">
                                {account.subtype || account.type}
                            </p>

                            <div className="account-balance">
                                <span>Current balance</span>
                                <strong>
                                    {account.balances.current !== null
                                        ? `${account.balances.iso_currency_code || ""} ${account.balances.current.toFixed(2)}`
                                        : "Unavailable"}
                                </strong>
                            </div>

                            {account.balances.available !== null && (
                                <p className="available-balance">
                                    Available: {account.balances.available.toFixed(2)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        )}

        {transactions.length > 0 && (
            <section className="plaid-section">
                <h2>Recent Transactions</h2>

                <div className="transactions-list">
                    {transactions.map((transaction) => (
                        <div
                            className="transaction-card"
                            key={transaction.transaction_id}
                        >
                            <div className="transaction-info">
                                <strong>{transaction.name}</strong>
                                <span>{transaction.date}</span>
                            </div>

                            <div className="transaction-amount">
                                {transaction.iso_currency_code}{" "}
                                {transaction.amount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}
    </div>
);
}

export default PlaidConnect;