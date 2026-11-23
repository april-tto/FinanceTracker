// Fake data for the demo until we connect the database / Banking API
// Fields follow the Transaction + Category classes from our class diagram

export type Transaction = {
  transactionId: number;
  amount: number;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
};

export const sampleTransactions: Transaction[] = [
  { transactionId: 1, amount: 1450, date: "2026-10-01", type: "income", category: "Paycheck", description: "Part-time job" },
  { transactionId: 2, amount: 1450, date: "2026-10-15", type: "income", category: "Paycheck", description: "Part-time job" },
  { transactionId: 3, amount: 950, date: "2026-10-01", type: "expense", category: "Rent", description: "Rent (shared apartment)" },
  { transactionId: 4, amount: 86.4, date: "2026-10-03", type: "expense", category: "Groceries", description: "No Frills" },
  { transactionId: 5, amount: 112.25, date: "2026-10-17", type: "expense", category: "Groceries", description: "Walmart" },
  { transactionId: 6, amount: 18.99, date: "2026-10-05", type: "expense", category: "Subscriptions", description: "Netflix" },
  { transactionId: 7, amount: 11.99, date: "2026-10-05", type: "expense", category: "Subscriptions", description: "Spotify" },
  { transactionId: 8, amount: 156, date: "2026-10-02", type: "expense", category: "Transportation", description: "Presto monthly pass" },
  { transactionId: 9, amount: 24.5, date: "2026-10-08", type: "expense", category: "Eating Out", description: "Tim Hortons" },
  { transactionId: 10, amount: 47.8, date: "2026-10-11", type: "expense", category: "Eating Out", description: "Uber Eats" },
  { transactionId: 11, amount: 62.3, date: "2026-10-19", type: "expense", category: "Eating Out", description: "Uber Eats" },
  { transactionId: 12, amount: 35, date: "2026-10-24", type: "expense", category: "Eating Out", description: "Pizza with friends" },
  { transactionId: 13, amount: 129.99, date: "2026-10-20", type: "expense", category: "Shopping", description: "Amazon" },
  { transactionId: 14, amount: 55, date: "2026-10-10", type: "expense", category: "Phone", description: "Phone bill" },
  { transactionId: 15, amount: 200, date: "2026-10-28", type: "expense", category: "Savings", description: "Transfer to savings" },
];

// small helper so the chatbot (and later the dashboard) can get a quick summary
export function getSummary(transactions: Transaction[]) {
  let income = 0;
  let expenses = 0;
  const byCategory: { [key: string]: number } = {};

  for (const t of transactions) {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expenses += t.amount;
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }
  }

  // sort categories from biggest to smallest
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return {
    income: Math.round(income * 100) / 100,
    expenses: Math.round(expenses * 100) / 100,
    left: Math.round((income - expenses) * 100) / 100,
    categories,
  };
}
