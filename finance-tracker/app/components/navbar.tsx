import React from 'react';
import Link from 'next/link';
import './navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link href="/login">Finance Tracker</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link href="/analyzespending">Analyze Spendings</Link>
                </li>
                <li>
                    <Link href="/plangoal">Plan Goal</Link>
                </li>
                <li>
                    <Link href="/askadvice">Ask Advice</Link>
                </li>
                                <li>
                    <Link href="/logout">Logout</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;
