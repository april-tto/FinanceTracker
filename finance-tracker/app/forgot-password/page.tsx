
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage(
      'If an account is associated with this email address, password recovery instructions would be sent.'
    );

    setSubmitted(true);
  };

  return (
    <main className="forgot-page">

      <div className="forgot-card">

        <div className="forgot-icon">
          ?
        </div>

        <h1>Forgot Your Password?</h1>

        <p>
          Enter the email address associated with your
          FinanceTracker account to begin the recovery process.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="recoveryEmail">Email Address</label>

              <input
                type="email"
                id="recoveryEmail"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Recover Password
            </button>

          </form>
        ) : (
          <div className="recovery-message" role="status">
            <h3>Request Submitted!</h3>
            <p>{message}</p>
          </div>
        )}

        <Link href="/login" className="back-login">
          ← Back to Login
        </Link>

      </div>

    </main>
  );
}
