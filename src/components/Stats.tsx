import React from 'react';

const Stats = () => {
  return (
    <div className="stats-container">
      <div className="stats-inner">
        <div className="sp-stats stats-grid-override reveal-stagger">
          <div className="sp-stat sp-stat-transparent">
            <div className="sp-stat-val">2,400+</div>
            <div className="sp-stat-label">Active Shops</div>
          </div>
          <div className="sp-stat sp-stat-transparent">
            <div className="sp-stat-val">₹12Cr+</div>
            <div className="sp-stat-label">Dues Tracked</div>
          </div>
          <div className="sp-stat sp-stat-transparent">
            <div className="sp-stat-val">98%</div>
            <div className="sp-stat-label">Payment Recovery</div>
          </div>
          <div className="sp-stat sp-stat-transparent sp-stat-no-border">
            <div className="sp-stat-val">4.9★</div>
            <div className="sp-stat-label">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
