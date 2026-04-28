"use client";

import React from 'react';
import Link from 'next/link';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, lastUpdated, children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FF', padding: '80px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '60px', borderRadius: '32px', boxShadow: '0 20px 60px rgba(79,70,229,0.1)' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6B7280', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginBottom: '32px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Home
        </Link>
        
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '36px', fontWeight: '800', color: '#0A0E1A', marginBottom: '8px', letterSpacing: '-1px' }}>{title}</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '48px' }}>Last Updated: {lastUpdated}</p>
        
        <div className="legal-content" style={{ color: '#1E2440', lineHeight: '1.8', fontSize: '16px' }}>
          {children}
        </div>
      </div>
      
      <style jsx>{`
        .legal-content h2 {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 700;
          margin: 40px 0 16px;
          color: #0A0E1A;
        }
        .legal-content p {
          margin-bottom: 20px;
        }
        .legal-content ul {
          margin-bottom: 24px;
          padding-left: 20px;
        }
        .legal-content li {
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
};

export default LegalPage;
