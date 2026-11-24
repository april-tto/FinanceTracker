import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        Welcome to the Dashboard
      </h1>
      
      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
        
        {/* This is the link to YOUR feature */}
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
    </div>
  );
}