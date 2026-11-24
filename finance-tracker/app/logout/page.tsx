
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Logout() {
  const router = useRouter();
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => {
    // Clear the temporary FinanceTracker login session
    sessionStorage.removeItem('financeTrackerSession');

    setLoggedOut(true);

    // Redirect to the home page
    router.push('/');
  };

  return (
    <main className="logout-page">

      <div className="logout-card">

        <div className="logout-icon">
          {loggedOut ? '✓' : '?'}
        </div>

        {!loggedOut ? (
          <>
            <h1>Confirm Logout</h1>

            <p>
              Are you sure you want to log out of
              your FinanceTracker account?
            </p>

            <p className="logout-subtitle">
              Your session will be cleared once you confirm.
            </p>

            <button
              type="button"
              className="return-button"
              onClick={handleLogout}
            >
              Confirm Logout
            </button>

            <button
              type="button"
              className="cancel-logout-button"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h1>You Have Logged Out!</h1>

            <p>
              You have successfully logged out of your
              FinanceTracker account.
            </p>

            <p className="logout-subtitle">
              Thank you for using FinanceTracker.
              We hope to see you again soon!
            </p>
          </>
        )}

      </div>

    </main>
  );
}

