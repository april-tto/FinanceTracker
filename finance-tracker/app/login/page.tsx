
'use client';

import React, { useState } from 'react';

export default function Login() {
  const [registerMessage, setRegisterMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  // Password visibility
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Registration password strength
  const [registerPassword, setRegisterPassword] = useState('');

  const passwordChecks = [
    {
      label: 'At least 8 characters',
      valid: registerPassword.length >= 8,
    },
    {
      label: 'One uppercase letter',
      valid: /[A-Z]/.test(registerPassword),
    },
    {
      label: 'One lowercase letter',
      valid: /[a-z]/.test(registerPassword),
    },
    {
      label: 'One number',
      valid: /[0-9]/.test(registerPassword),
    },
    {
      label: 'One special character',
      valid: /[^A-Za-z0-9]/.test(registerPassword),
    },
  ];

  const strength = passwordChecks.filter(check => check.valid).length;

  const strengthLabel =
    registerPassword.length === 0 ? '' :
    strength <= 2 ? 'Weak' :
    strength <= 4 ? 'Medium' : 'Strong';

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

    if (strength < 5) {
      setRegisterMessage('Please create a stronger password.');
      return;
    }

    setRegisterMessage('Registration successful!');
    form.reset();
    setRegisterPassword('');
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create a temporary login session for the prototype
    sessionStorage.setItem('financeTrackerSession', 'active');

    setLoginMessage('Login successful!');
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

            {/* REGISTRATION PASSWORD */}

            <div className="form-group">
              <label htmlFor="registerPassword">Create Password</label>

              <div className="password-wrapper">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  id="registerPassword"
                  name="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={8}
                  value={registerPassword}
                  onChange={(e) => {
                    setRegisterPassword(e.target.value);
                    setRegisterMessage('');
                  }}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                >
                  {showRegisterPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* PASSWORD STRENGTH INDICATOR */}

              {registerPassword.length > 0 && (
                <div className="password-strength">

                  <div className="strength-heading">
                    <span>Password Strength</span>
                    <strong className={`strength-${strengthLabel.toLowerCase()}`}>
                      {strengthLabel}
                    </strong>
                  </div>

                  <div className="strength-bars">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <div
                        key={bar}
                        className={
                          bar <= strength
                            ? `strength-bar strength-bar-${strengthLabel.toLowerCase()}`
                            : 'strength-bar'
                        }
                      />
                    ))}
                  </div>

                  <ul className="password-requirements">
                    {passwordChecks.map((check) => (
                      <li key={check.label} className={check.valid ? 'valid' : ''}>
                        {check.valid ? '✓' : '○'} {check.label}
                      </li>
                    ))}
                  </ul>

                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>

              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
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

            {/* LOGIN PASSWORD */}

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>

              <div className="password-wrapper">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  id="loginPassword"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">
                Forgot Password?
              </a>
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
