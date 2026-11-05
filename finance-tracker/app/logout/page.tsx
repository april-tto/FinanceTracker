
import Link from 'next/link';

export default function Logout() {
  return (
    <main className="logout-page">

      <div className="logout-card">

        <div className="logout-icon">
          ✓
        </div>

        <h1>You have Logged Out!</h1>

        <p>
          You have successfully logged out of your
          FinanceTracker account.
        </p>

        <p className="logout-subtitle">
          Thank you for using FinanceTracker.
          We hope to see you again soon!
        </p>

        <Link href="/" className="return-button">
          Return to Home
        </Link>

      </div>

    </main>
  );
}
