import React from 'react';

const Features = () => {
  return (
    <section className="features-bg" id="features">
      <div className="section-inner">
        <div className="section-head reveal reveal-up">
          <div className="section-chip">✦ Features</div>
          <h2 className="section-title">Everything Your Shop <span>Needs</span></h2>
          <p className="section-sub">Powerful features designed specifically for Kirana, Medical, and Hardware shops to replace paper khatas forever.</p>
        </div>
        <div className="features-grid reveal-stagger">
          <div className="feat-card">
            <div className="feat-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="feat-title">Instant Credit Tracking</div>
            <p className="feat-desc">Record customer dues in seconds. Add purchase details, amounts, and notes right from your phone or computer.</p>
            <div className="feat-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Record in under 5 seconds
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon feat-icon-green">
              <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <div className="feat-title">Full Payment History</div>
            <p className="feat-desc">Every partial payment and full settlement is logged with timestamps. Never dispute a payment again.</p>
            <div className="feat-tag feat-tag-green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Full audit trail
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon feat-icon-orange">
              <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div className="feat-title">Live Due Updates</div>
            <p className="feat-desc">Real-time balance sync across devices. Your customer sees the same balance you do, always up to date.</p>
            <div className="feat-tag feat-tag-orange">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Syncs in real-time
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon feat-icon-pink">
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div className="feat-title">Automated Reminders</div>
            <p className="feat-desc">Send payment reminders via SMS or WhatsApp automatically. Schedule them weekly or before due dates.</p>
            <div className="feat-tag feat-tag-pink">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              WhatsApp + SMS
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon feat-icon-cyan">
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div className="feat-title">Digital Khata Book</div>
            <p className="feat-desc">Generate professional monthly PDF statements for each customer automatically. Share digitally or print.</p>
            <div className="feat-tag feat-tag-cyan">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Monthly PDF reports
            </div>
          </div>
          <div className="feat-card">
            <div className="feat-icon feat-icon-lime">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <div className="feat-title">Customer Portal</div>
            <p className="feat-desc">Give customers their own login to check live due balance, payment history, and download statements anytime.</p>
            <div className="feat-tag feat-tag-lime">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Self-service portal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
