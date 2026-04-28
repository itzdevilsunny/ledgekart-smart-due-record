import React from 'react';
import Link from 'next/link';

const CTA = () => {
  return (
    <div className="cta-section">
      <div className="cta-card reveal reveal-jump">
        <h2 className="cta-h">Ready to Go Digital with<br/>Your Khata Book?</h2>
        <p className="cta-sub">Join 2,400+ shopkeepers who&apos;ve already switched to LedgerKart.<br/>Start free — no credit card required.</p>
        <div className="cta-btns">
          <Link href="/register?role=admin" className="btn-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Register Your Shop Free
          </Link>
          <Link href="/login?role=admin" className="btn-white-outline">Watch Demo →</Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
