import React from 'react';

const HowItWorks = () => {
  return (
    <section className="how-bg" id="how">
      <div className="section-inner">
        <div className="section-head reveal reveal-up">
          <div className="section-chip">✦ How it Works</div>
          <h2 className="section-title">Up & Running in <span>3 Simple Steps</span></h2>
          <p className="section-sub">Start managing your shop&apos;s dues digitally in minutes, no technical knowledge required.</p>
        </div>
        <div className="steps-wrapper reveal-stagger">
          <div className="steps-line"></div>
          <div className="step-card">
            <div className="step-num">1</div>
            <div className="step-title">Add a Customer</div>
            <p className="step-desc">Enter the customer&apos;s name and phone number. They get a welcome SMS with their portal login automatically.</p>
            <div className="step-mockup">
              <div className="sm-row">
                <div className="sm-dot dot-indigo"></div>
                <span className="sm-text">Name</span>
                <span className="sm-val val-ink2">Ramesh Kumar</span>
              </div>
              <div className="sm-row">
                <div className="sm-dot dot-green"></div>
                <span className="sm-text">Mobile</span>
                <span className="sm-val val-ink2">+91 98765 XXXXX</span>
              </div>
              <div className="sm-row">
                <div className="sm-dot dot-amber"></div>
                <span className="sm-text">Credit Limit</span>
                <span className="sm-val val-amber">₹10,000</span>
              </div>
            </div>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <div className="step-title">Record a Purchase</div>
            <p className="step-desc">Log each sale on credit with item details and amount. The customer&apos;s due balance updates instantly.</p>
            <div className="step-mockup">
              <div className="sm-row">
                <div className="sm-dot dot-red"></div>
                <span className="sm-text">Item</span>
                <span className="sm-val val-ink2">Rice 10kg</span>
              </div>
              <div className="sm-row">
                <div className="sm-dot dot-red"></div>
                <span className="sm-text">Amount</span>
                <span className="sm-val val-red">₹ 850</span>
              </div>
              <div className="sm-row">
                <div className="sm-dot dot-indigo"></div>
                <span className="sm-text">Balance</span>
                <span className="sm-val val-red">₹3,450 due</span>
              </div>
            </div>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <div className="step-title">Payment & Live Update</div>
            <p className="step-desc">Record full or partial payments. The balance updates in real-time and the customer gets a payment receipt on WhatsApp.</p>
            <div className="step-mockup">
              <div className="sm-row">
                <div className="sm-dot dot-green"></div>
                <span className="sm-text">Paid</span>
                <span className="sm-val val-green">+₹2,000</span>
              </div>
              <div className="sm-row">
                <div className="sm-dot dot-amber"></div>
                <span className="sm-text">Remaining</span>
                <span className="sm-val val-amber">₹1,450</span>
              </div>
              <div className="sm-row">
                <div className="sm-dot dot-cyan"></div>
                <span className="sm-text">Receipt</span>
                <span className="sm-val val-cyan">Sent ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
