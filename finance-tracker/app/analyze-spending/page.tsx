"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Transaction {
  id: number;
  amount: number;
  date: string;
  category: string;
  description: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, amount: 15.50, date: "2024-03-01", category: "Food", description: "Lunch" },
  { id: 2, amount: 60.00, date: "2024-03-02", category: "Groceries", description: "Weekly shop" },
  { id: 3, amount: 15.99, date: "2024-03-03", category: "Subscriptions", description: "Netflix" },
  { id: 4, amount: 45.00, date: "2024-03-04", category: "Transport", description: "Gas" },
  { id: 5, amount: 15.99, date: "2024-04-03", category: "Subscriptions", description: "Netflix" }, // Recurring
  { id: 6, amount: 15.50, date: "2024-04-01", category: "Food", description: "Lunch" },
  { id: 7, amount: 120.00, date: "2024-04-05", category: "Shopping", description: "Shoes" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyzeSpendingPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [categoryTotals, setCategoryTotals] = useState<{ name: string; total: number }[]>([]);
  const [recurring, setRecurring] = useState<Transaction[]>([]);

  useEffect(() => {
    // 1. Calculate totals per category for the chart
    const totalsMap: Record<string, number> = {};
    transactions.forEach(t => {
      totalsMap[t.category] = (totalsMap[t.category] || 0) + t.amount;
    });
    const formattedTotals = Object.keys(totalsMap).map(key => ({
      name: key,
      total: totalsMap[key]
    })).sort((a, b) => b.total - a.total); // Sort highest to lowest

    setCategoryTotals(formattedTotals);

    // 2. Detect Recurring Purchases (same description, different months)
    const recurringMap: Record<string, Transaction[]> = {};
    transactions.forEach(t => {
      if (!recurringMap[t.description]) recurringMap[t.description] = [];
      recurringMap[t.description].push(t);
    });
    
    const recurringItems = Object.values(recurringMap)
      .filter(items => items.length > 1) // If it appears more than once, it's recurring
      .map(items => items[0]); // Just take the first one as a representation

    setRecurring(recurringItems);
  }, [transactions]);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Spending Insights</h1>
      
      {/* Chart Section */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>Spending by Category</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={categoryTotals} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]}>
                {categoryTotals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recurring Purchases Section */}
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Detected Recurring Expenses</h2>
        {recurring.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {recurring.map(item => (
              <li key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.description} <span style={{ color: '#6b7280', fontSize: '14px' }}>({item.category})</span></span>
                <span style={{ fontWeight: 'bold' }}>${item.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recurring purchases detected yet.</p>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/dashboard" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 'bold' }}>← Back to Dashboard</a>
      </div>
    </div>
  );
}