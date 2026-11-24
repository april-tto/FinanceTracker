"use client";

import { useEffect, useState } from "react";
import { sampleTransactions, Transaction } from "../api/data/sampleTransactions";
import "./transactions.css";

const CATEGORIES = [
  "Paycheck",
  "Rent",
  "Groceries",
  "Eating Out",
  "Transportation",
  "Subscriptions",
  "Shopping",
  "Phone",
  "Savings",
  "Other",
];

const STORAGE_KEY = "financeTracker.transactions";

function today() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

const emptyForm = {
  description: "",
  amount: "",
  date: today(),
  type: "expense" as "income" | "expense",
  category: "Groceries",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTransactions(JSON.parse(saved));
      }
    } catch {
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
    }
  }, [transactions, loaded]);

  function showMessage(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amount = Number(form.amount);

    if (form.description.trim() === "") {
      setError("Please enter a description.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be a number greater than 0.");
      return;
    }
    if (form.date === "") {
      setError("Please choose a date.");
      return;
    }
    setError("");

    if (editingId === null) {
      const nextId = transactions.length > 0
        ? Math.max(...transactions.map((t) => t.transactionId)) + 1
        : 1;
      const newTransaction: Transaction = {
        transactionId: nextId,
        description: form.description.trim(),
        amount: Math.round(amount * 100) / 100,
        date: form.date,
        type: form.type,
        category: form.category,
      };
      setTransactions([newTransaction, ...transactions]);
      showMessage("Transaction added.");
    } else {
      setTransactions(
        transactions.map((t) =>
          t.transactionId === editingId
            ? {
                ...t,
                description: form.description.trim(),
                amount: Math.round(amount * 100) / 100,
                date: form.date,
                type: form.type,
                category: form.category,
              }
            : t
        )
      );
      setEditingId(null);
      showMessage("Transaction updated.");
    }

    setForm({ ...emptyForm, date: today() });
  }

  function startEdit(t: Transaction) {
    setEditingId(t.transactionId);
    setForm({
      description: t.description,
      amount: String(t.amount),
      date: t.date,
      type: t.type,
      category: CATEGORIES.includes(t.category) ? t.category : "Other",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ ...emptyForm, date: today() });
    setError("");
  }

  function deleteTransaction(t: Transaction) {
    if (!window.confirm(`Delete "${t.description}"?`)) return;
    setTransactions(transactions.filter((item) => item.transactionId !== t.transactionId));
    if (editingId === t.transactionId) cancelEdit();
    showMessage("Transaction deleted.");
  }

  function resetData() {
    if (!window.confirm("Reset all transactions to the demo data?")) return;
    setTransactions(sampleTransactions);
    cancelEdit();
    showMessage("Demo data restored.");
  }

  const visible = transactions
    .filter((t) => typeFilter === "all" || t.type === typeFilter)
    .filter((t) => categoryFilter === "all" || t.category === categoryFilter)
    .filter((t) => t.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  let income = 0;
  let expenses = 0;
  for (const t of visible) {
    if (t.type === "income") income += t.amount;
    else expenses += t.amount;
  }
  const balance = income - expenses;

  function exportToCSV() {
    if (visible.length === 0) {
      showMessage("Nothing to export.");
      return;
    }

    const cell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

    const header = ["ID", "Date", "Description", "Category", "Type", "Amount"];
    const rows = visible.map((t) =>
      [t.transactionId, t.date, t.description, t.category, t.type, t.amount.toFixed(2)]
        .map(cell)
        .join(",")
    );
    const csv = [header.map(cell).join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${today()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showMessage(`Exported ${visible.length} transactions to CSV.`);
  }

  const money = (n: number) => (n < 0 ? "-" : "") + "$" + Math.abs(n).toFixed(2);

  return (
    <div className="tx-page">
      <header className="tx-header">
        <div>
          <h1>Transactions</h1>
          <p>Add, edit and delete your income and expenses. Export them to a CSV file.</p>
        </div>
        <div className="tx-header-buttons">
          <button className="tx-btn tx-btn-light" onClick={resetData}>Reset demo data</button>
          <button className="tx-btn tx-btn-green" onClick={exportToCSV}>Export to CSV</button>
        </div>
      </header>

      <section className="tx-summary">
        <div className="tx-card">
          <span>Income</span>
          <strong className="tx-income">{money(income)}</strong>
        </div>
        <div className="tx-card">
          <span>Expenses</span>
          <strong className="tx-expense">{money(expenses)}</strong>
        </div>
        <div className="tx-card tx-card-dark">
          <span>Balance</span>
          <strong>{money(balance)}</strong>
        </div>
      </section>

      <section className={editingId === null ? "tx-form-box" : "tx-form-box tx-editing"}>
        <h2>{editingId === null ? "Add a transaction" : "Edit transaction"}</h2>
        <form onSubmit={handleSubmit} className="tx-form">
          <label>
            Description
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Walmart"
            />
          </label>

          <label>
            Amount ($)
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>

          <label>
            Type
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <div className="tx-form-buttons">
            <button type="submit" className="tx-btn tx-btn-green">
              {editingId === null ? "Add" : "Save changes"}
            </button>
            {editingId !== null && (
              <button type="button" className="tx-btn tx-btn-light" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="tx-error">{error}</p>}
      </section>

      {message && <p className="tx-message" role="status">{message}</p>}

      <section className="tx-filters">
        <input
          type="text"
          placeholder="Search by description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </section>

      <section className="tx-table-box">
        {visible.length === 0 ? (
          <p className="tx-empty">No transactions found.</p>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="tx-right">Amount</th>
                <th className="tx-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.transactionId} className={editingId === t.transactionId ? "tx-row-editing" : ""}>
                  <td>{t.date}</td>
                  <td>{t.description}</td>
                  <td><span className="tx-tag">{t.category}</span></td>
                  <td className={t.type === "income" ? "tx-right tx-income" : "tx-right tx-expense"}>
                    {t.type === "income" ? "+" : "−"}{money(t.amount)}
                  </td>
                  <td className="tx-right tx-actions">
                    <button onClick={() => startEdit(t)}>Edit</button>
                    <button className="tx-delete" onClick={() => deleteTransaction(t)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="tx-count">Showing {visible.length} of {transactions.length} transactions</p>
      </section>
    </div>
  );
}
