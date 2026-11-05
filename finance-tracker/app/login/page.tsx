
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [registerMessage, setRegisterMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setRegisterMessage('Passwords do not match. Please try again.');
      return;
    }

    setRegisterMessage(
      'Registration sucessful.'
    );
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoginMessage(
      'Login Succesful.'
    );

    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);

  };

  return (
    <main className="auth-page">

      <header className="auth-header">
        <h1>FinanceTracker</h1>
        <p>Take control of your financial future.</p>
      </header>

      <section className="auth-container">

        {/* NEW USER REGISTRATION */}

        <div className="auth-panel register-panel">

          <h2>Create an Account</h2>

          <p className="panel-description">
            New users? Register here to get started.
          </p>

          <form onSubmit={handleRegister}>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registerEmail">Email Address</label>
              <input
                type="email"
                id="registerEmail"
                name="email"
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registerPassword">Create Password</label>
              <input
                type="password"
                id="registerPassword"
                name="password"
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Create Account
            </button>

            {registerMessage && (
              <p className="form-message" role="status">
                {registerMessage}
              </p>
            )}

          </form>
        </div>

        {/* RETURNING USER LOGIN */}

        <div className="auth-panel login-panel">

          <h2>Welcome Back!</h2>

          <p className="panel-description">
            Already have an account? Login here.
          </p>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Login
            </button>

            {loginMessage && (
              <p className="form-message" role="status">
                {loginMessage}
              </p>
            )}

          </form>

          <div className="login-footer">
            <p>Your finances. Your goals. Your future.</p>
          </div>

        </div>

      </section>

      <footer className="auth-footer">
        <p>FinanceTracker © 2026 | Manage Your Money Wisely</p>
      </footer>

    </main>
  );
}
