import React from 'react';
import Link from 'next/link';
import PlaidConnect from '../components/PlaidConnect';

export default function Dashboard() {
  // ... rest of your code
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        Welcome to the Dashboard
      </h1>
      
      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
        
        {/* This is YOUR link */}
        <Link 
          href="/analyze-spending" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          View Spending Analysis
        </Link>
        
      </div>

      {/* This is THEIR component */}
      {/* Note: If <PlaidConnect /> is not defined in this file, you might need to import it at the top! */}
      <div style={{ marginTop: '30px' }}>
        <PlaidConnect />
      </div>

    </div>
  );
}