"use client";

import React, { useState, useEffect } from 'react';

interface Transaction {
  id: number;
  amount: number;
  date: string;
  category: string;
  description: string;
}

export default function AnalyzeSpendingPage() {
  const [transactions] = useState<Transaction[]>([
    { id: 1, amount: 15.50, date: "2024-03-01", category: "Food", description: "Lunch" },
    { id: 2, amount: 60.00, date: "2024-03-02", category: "Groceries", description: "Weekly shop" },
    { id: 3, amount: 12.99, date: "2024-03-03", category: "Subscriptions", description: "Netflix" },
    { id: 4, amount: 45.00, date: "2024-03-04", category: "Transport", description: "Gas" },
    { id: 5, amount: 12.99, date: "2024-04-03", category: "Subscriptions", description: "Netflix" },
  ]);

  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [mostSpent, setMostSpent] = useState<{ category: string; amount: number } | null>(null);
  const [leastSpent, setLeastSpent] = useState<{ category: string; amount: number } | null>(null);

  useEffect(() => {
    const totals: Record<string, number> = {};
    transactions.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    setCategoryTotals(totals);

    const categories = Object.keys(totals);
    if (categories.length > 0) {
      const sorted = categories.sort((a, b) => totals[b] - totals[a]);
      setMostSpent({ category: sorted[0], amount: totals[sorted[0]] });
      setLeastSpent({ category: sorted[sorted.length - 1], amount: totals[sorted[sorted.length - 1]] });
    }
  }, [transactions]);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Spending Analysis</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Summary</h2>
        {mostSpent && <p style={{ fontSize: '18px', marginBottom: '5px' }}>📈 Most spent on: <strong>{mostSpent.category}</strong> (${mostSpent.amount.toFixed(2)})</p>}
        {leastSpent && <p style={{ fontSize: '18px' }}>📉 Least spent on: <strong>{leastSpent.category}</strong> (${leastSpent.amount.toFixed(2)})</p>}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Breakdown by Category</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #e5e7eb' }}>
        <thead style={{ backgroundColor: '#f9fafb' }}>
          <tr>
            <th style={{ padding: '12px', borderBottom: '2px solid #e5e7eb' }}>Category</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #e5e7eb' }}>Total Spent ($)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(categoryTotals).map(([category, total]) => (
            <tr key={category} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px' }}>{category}</td>
              <td style={{ padding: '12px' }}>{total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '40px' }}>
        <a href="/dashboard" style={{ color: 'blue', textDecoration: 'underline' }}>← Back to Dashboard</a>
      </div>
    </div>
  );
}