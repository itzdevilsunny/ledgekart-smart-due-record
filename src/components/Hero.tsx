import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-content reveal reveal-left">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Now with WhatsApp Reminders
          </div>
          <h1>Manage Customer<br/>Dues <span>Digitally</span><br/>& Grow Your Shop</h1>
          <p className="hero-sub">Replace your traditional paper Khata with LedgerKart. Track credit, receive payments, and send automatic reminders — all in one seamless platform.</p>
          <div className="hero-ctas">
            <Link href="/register" className="btn-primary btn-lg">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Register Your Shop
            </Link>
            <Link href="/login?role=admin" className="btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
              Admin Login
            </Link>
            <Link href="/login?role=customer" className="btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Customer Login
            </Link>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars">
              <div className="trust-avatar trust-avatar-1">R</div>
              <div className="trust-avatar trust-avatar-2">M</div>
              <div className="trust-avatar trust-avatar-3">S</div>
              <div className="trust-avatar trust-avatar-4">K</div>
            </div>
            <span>Trusted by <strong className="trust-count">2,400+</strong> local shopkeepers</span>
          </div>
        </div>
        <div className="hero-visual reveal reveal-right">
          <div className="mockup-card">
            <div className="mockup-header">
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
              <div className="mockup-dot"></div>
              <span className="mockup-title">LedgerKart Dashboard</span>
            </div>
            <div className="mockup-body">
              <div className="m-stat-row">
                <div className="m-stat">
                  <div className="m-stat-label">Total Dues</div>
                  <div className="m-stat-val red m-stat-val-red">₹84,200</div>
                  <div className="m-stat-sub">38 customers</div>
                </div>
                <div className="m-stat">
                  <div className="m-stat-label">Collected</div>
                  <div className="m-stat-val green">₹52,400</div>
                  <div className="m-stat-sub">This month</div>
                </div>
                <div className="m-stat">
                  <div className="m-stat-label">Pending</div>
                  <div className="m-stat-val amber">₹31,800</div>
                  <div className="m-stat-sub">12 pending</div>
                </div>
              </div>
              <div className="m-list-label">Recent Transactions</div>
              <div className="m-list-item">
                <div className="m-list-left">
                  <div className="m-avatar m-avatar-purple">RK</div>
                  <div>
                    <div className="m-name">Ramesh Kumar</div>
                    <div className="m-date">Today, 2:30 PM</div>
                  </div>
                </div>
                <div className="m-text-right">
                  <div className="m-amt red">-₹3,400</div>
                  <span className="m-badge badge-due">Due</span>
                </div>
              </div>
              <div className="m-list-item">
                <div className="m-list-left">
                  <div className="m-avatar m-avatar-green">PS</div>
                  <div>
                    <div className="m-name">Priya Sharma</div>
                    <div className="m-date">Today, 11:15 AM</div>
                  </div>
                </div>
                <div className="m-text-right">
                  <div className="m-amt green">+₹1,200</div>
                  <span className="m-badge badge-paid">Paid</span>
                </div>
              </div>
              <div className="m-list-item">
                <div className="m-list-left">
                  <div className="m-avatar m-avatar-orange">MV</div>
                  <div>
                    <div className="m-name">Mohan Verma</div>
                    <div className="m-date">Yesterday</div>
                  </div>
                </div>
                <div className="m-text-right">
                  <div className="m-amt amber">₹800</div>
                  <span className="m-badge badge-partial">Partial</span>
                </div>
              </div>
            </div>
          </div>
          <div className="float-card fc1">
            <div className="fc-icon fc-icon-green">💬</div>
            <div>
              <div className="fc-label">Reminder Sent</div>
              <div className="fc-val">WhatsApp ✓</div>
            </div>
          </div>
          <div className="float-card fc2">
            <div className="fc-icon fc-icon-blue">📄</div>
            <div>
              <div className="fc-label">PDF Khata</div>
              <div className="fc-val">Generated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
