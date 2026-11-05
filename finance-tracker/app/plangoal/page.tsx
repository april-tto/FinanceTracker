
'use client';
import { useState } from 'react';

export default function Plangoal() {
  const [goal, setGoal] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');
  const [paychecks, setPaychecks] = useState('');
  const [result, setResult] = useState<number | null>(null);

  function calculateSavings() {
    const remaining = Number(target) - Number(saved);
    const checks = Number(paychecks);

    if (
      !goal.trim() ||
      target === '' ||
      saved === '' ||
      paychecks === '' ||
      !Number.isFinite(Number(target)) ||
      !Number.isFinite(Number(saved)) ||
      !Number.isFinite(checks) ||
      Number(target) <= 0 ||
      Number(saved) < 0 ||
      Number(saved) > Number(target) ||
      checks <= 0
    ) {
      alert('Please enter valid information.');
      return;
    }

    setResult(remaining / checks);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1>Plan Saving Goals</h1>
      <p>Create a goal and calculate your savings.</p>

      <h3>Goal Name</h3>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="e.g. New Laptop"
      />

      <h3>Target Amount ($)</h3>
      <input
        type="number"
        value={target}
        onChange={(e) => {
          setTarget(e.target.value);
          setResult(null);
        }}
        placeholder="2000"
      />

      <h3>Current Savings ($)</h3>
      <input
        type="number"
        value={saved}
        onChange={(e) => {
          setSaved(e.target.value);
          setResult(null);
        }}
        placeholder="500"
      />

      <h3>Paychecks Remaining</h3>
      <input
        type="number"
        value={paychecks}
        onChange={(e) => {
          setPaychecks(e.target.value);
          setResult(null);
        }}
        placeholder="12"
      />

      <br /><br />

      <button onClick={calculateSavings}>
        Calculate Savings
      </button>

      {result !== null && (
        <div>
          <h2>Your Saving Goal: {goal}</h2>
          <p>Target: ${Number(target).toFixed(2)}</p>
          <p>Already Saved: ${Number(saved).toFixed(2)}</p>
          <p>Remaining: ${(Number(target) - Number(saved)).toFixed(2)}</p>
          <h3>Save ${result.toFixed(2)} per paycheck!</h3>
        </div>
      )}
    </div>
  );
}
