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
    <div className="legal-container">
      <div className="legal-card">
        <Link href="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Home
        </Link>
        
        <h1 className="legal-title">{title}</h1>
        <p className="legal-date">Last Updated: {lastUpdated}</p>
        
        <div className="legal-content">
          {children}
        </div>
      </div>
      
      <style jsx>{`
        .legal-container {
          min-height: 100vh;
          background: #F8F9FF;
          padding: 80px 20px;
        }
        .legal-card {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          padding: 60px;
          border-radius: 32px;
          box-shadow: 0 20px 60px rgba(79,70,229,0.1);
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #6B7280;
          text-decoration: none;
          fontSize: 14px;
          font-weight: 600;
          margin-bottom: 32px;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: var(--primary);
        }
        .legal-title {
          font-family: 'Sora, sans-serif';
          font-size: 36px;
          font-weight: 800;
          color: #0A0E1A;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }
        .legal-date {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 48px;
        }
        .legal-content {
          color: #1E2440;
          line-height: 1.8;
          font-size: 16px;
        }
        .legal-content :global(h2) {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 700;
          margin: 40px 0 16px;
          color: #0A0E1A;
        }
        .legal-content :global(p) {
          margin-bottom: 20px;
        }
        .legal-content :global(ul) {
          margin-bottom: 24px;
          padding-left: 20px;
        }
        .legal-content :global(li) {
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
};

export default LegalPage;
