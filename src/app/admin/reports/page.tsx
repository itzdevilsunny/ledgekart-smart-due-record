"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getDashboardStats, getCustomers, CustomerBalance, DashboardStats } from '@/utils/supabase';

export default function ReportsPage() {
  const { shop, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<CustomerBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!shop) {
      router.push('/register');
    } else {
      Promise.all([
        getDashboardStats(shop.id),
        getCustomers(shop.id)
      ]).then(([statsRes, custRes]) => {
        setStats(statsRes);
        setCustomers(custRes.data ?? []);
        setLoading(false);
      });
    }
  }, [shop, authLoading, router]);

  const fmt = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  if (loading) return <div className="dash-loading"><div className="spinner" /></div>;

  return (
    <div className="dash-page dash-max anim-1">
      
      {/* Top Header */}
      <div className="flex-between mb-32 flex-wrap gap-20">
        <div>
          <h1 className="dash-title">Reports & Analytics</h1>
          <p className="dash-sub">Real-time performance metrics and collection health.</p>
        </div>
        <div className="flex-gap-sm">
          <div className="date-picker-placeholder">
            <span>📅 Last 30 Days</span>
            <span className="picker-arrow">▼</span>
          </div>
          <button className="btn-primary">Create Report</button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="stats-grid mb-32">
        <div className="report-card">
          <div className="flex-between mb-12">
            <div className="report-icon-bg blue">📈</div>
            <span className="report-trend up">+12.4%</span>
          </div>
          <p className="report-label">Revenue Growth</p>
          <div className="report-val">{fmt(stats?.totalPurchase || 0)}</div>
        </div>
        <div className="report-card">
          <div className="flex-between mb-12">
            <div className="report-icon-bg green">💳</div>
            <span className="report-trend up">98.2%</span>
          </div>
          <p className="report-label">Collection Efficiency</p>
          <div className="report-val">
            {stats?.totalPurchase ? Math.round(((stats.totalPaid || 0) / stats.totalPurchase) * 100) : 0}%
          </div>
        </div>
        <div className="report-card">
          <div className="flex-between mb-12">
            <div className="report-icon-bg amber">🕒</div>
            <span className="report-trend neutral">+2 Days</span>
          </div>
          <p className="report-label">Avg. Credit Period</p>
          <div className="report-val">18 Days</div>
        </div>
        <div className="report-card">
          <div className="flex-between mb-12">
            <div className="report-icon-bg purple">👤</div>
            <span className="report-trend up">+45</span>
          </div>
          <p className="report-label">New Customers</p>
          <div className="report-val">{stats?.totalCustomers || 0}</div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="dash-card mb-32 p-32">
        <div className="flex-between mb-24">
          <div>
            <h3 className="chart-title">Revenue vs Collection Trend</h3>
            <p className="chart-sub">Tracking income versus realized payments over time</p>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="dot blue"></span> Revenue</span>
            <span className="legend-item"><span className="dot green"></span> Collection</span>
          </div>
        </div>
        <div className="trend-chart-box">
          {/* Custom SVG Trend Chart */}
          <svg viewBox="0 0 800 200" className="w-full">
            <path d="M0,150 Q200,50 400,120 T800,80" fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="5,5" className="anim-path" />
            <path d="M0,180 Q200,100 400,160 T800,120" fill="none" stroke="#10B981" strokeWidth="3" className="anim-path" />
          </svg>
          <div className="chart-labels">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
      </div>

      <div className="grid-2-col gap-32 mb-32">
        {/* Distribution Donut */}
        <div className="dash-card p-32">
          <h3 className="donut-title">Collection Status Distribution</h3>
          <div className="donut-content">
            <div className="donut-box">
              <div className="donut-hole">
                <span className="donut-total">₹8.4L</span>
                <span className="donut-label">Total</span>
              </div>
            </div>
            <div className="donut-legend">
              <div className="legend-row">
                <span className="flex-gap-xs align-center"><span className="dot green"></span> Paid</span>
                <span>72%</span>
              </div>
              <div className="legend-row">
                <span className="flex-gap-xs align-center"><span className="dot blue"></span> Pending</span>
                <span>18%</span>
              </div>
              <div className="legend-row">
                <span className="flex-gap-xs align-center"><span className="dot red"></span> Overdue</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Debtors */}
        <div className="dash-card p-32">
          <h3 className="debtor-title">Top Debtors by Ageing</h3>
          <div className="flex-col-gap">
            {customers.filter(c => c.balance_due > 0).slice(0, 3).map(c => (
              <div key={c.customer_id} className="mb-16">
                <div className="flex-between mb-4">
                  <span className="debtor-name">{c.name}</span>
                  <span className="debtor-amount">{fmt(c.balance_due)}</span>
                </div>
                <div className="progress-bar-bg"><div className="progress-bar-fill fill-red w-85" /></div>
                <p className="debtor-status">Overdue by 45 days</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className="dash-card">
        <div className="dash-section-header p-24">
          <div>
            <h3 className="size-18 font-800">Monthly Performance Summary</h3>
            <p className="size-13 opacity-60">Breakdown of sales and collection efficiency by month</p>
          </div>
          <div className="flex-gap-sm">
            <button className="btn-outline size-12 py-8">📥 Export PDF</button>
            <button className="btn-outline size-12 py-8">📊 Export Excel</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="cust-table">
            <thead>
              <tr>
                <th>MONTH</th>
                <th>TOTAL SALES</th>
                <th>COLLECTIONS</th>
                <th>PENDING</th>
                <th>GROWTH %</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-600">April 2026</td>
                <td className="font-700">{fmt(stats?.totalPurchase || 0)}</td>
                <td className="font-700">{fmt(stats?.totalPaid || 0)}</td>
                <td className="amount-red font-700">{fmt(stats?.totalDue || 0)}</td>
                <td className="amount-green font-700">+8.4%</td>
                <td><span className="cust-badge-clear">EXCELLENT</span></td>
              </tr>
              <tr className="history-row">
                <td>March 2026</td>
                <td>₹11,10,000</td>
                <td>₹9,40,000</td>
                <td>₹1,70,000</td>
                <td className="amount-green">+12.1%</td>
                <td><span className="status-badge-healthy">HEALTHY</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .report-card { background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 24px; transition: all 0.3s; }
        .report-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--accent-light); }
        .report-icon-bg { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .report-icon-bg.blue { background: #EEF2FF; }
        .report-icon-bg.green { background: #ECFDF5; }
        .report-icon-bg.amber { background: #FFF7ED; }
        .report-icon-bg.purple { background: #F5F3FF; }
        .report-trend { font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 6px; }
        .report-trend.up { background: #ECFDF5; color: #059669; }
        .report-trend.neutral { background: #F3F4F6; color: #6B7280; }
        .report-label { font-size: 14px; font-weight: 600; color: var(--muted); margin-bottom: 4px; }
        .report-val { font-size: 24px; font-weight: 800; color: var(--ink); }
        .date-picker-placeholder { background: var(--white); border: 1px solid var(--border); padding: 10px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; }
        .picker-arrow { margin-left: 8px; font-size: 10px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .dot.blue { background: var(--accent); }
        .dot.green { background: #10B981; }
        .dot.red { background: #EF4444; }
        
        .chart-title { font-size: 18px; font-weight: 800; }
        .chart-sub { font-size: 13px; opacity: 0.6; }
        .chart-legend { display: flex; gap: 16px; font-size: 12px; font-weight: 600; }
        .legend-item { display: flex; align-items: center; gap: 4px; }
        .chart-labels { display: flex; justify-content: space-between; margin-top: 12px; font-size: 12px; opacity: 0.4; font-weight: 600; }
        
        .donut-title { font-size: 16px; font-weight: 800; margin-bottom: 24px; }
        .donut-content { display: flex; align-items: center; justify-content: center; gap: 40px; }
        .donut-box { width: 140px; height: 140px; border-radius: 50%; border: 15px solid #10B981; border-top-color: var(--accent); border-right-color: #EF4444; display: flex; align-items: center; justify-content: center; position: relative; }
        .donut-hole { width: 110px; height: 110px; background: #fff; border-radius: 50%; position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .donut-total { font-size: 20px; font-weight: 800; }
        .donut-label { font-size: 11px; opacity: 0.6; }
        .donut-legend { display: flex; flex-direction: column; gap: 12px; font-size: 13px; font-weight: 600; }
        .legend-row { display: flex; justify-content: space-between; width: 140px; }
        
        .debtor-title { font-size: 16px; font-weight: 800; margin-bottom: 24px; }
        .debtor-name { font-size: 14px; font-weight: 700; }
        .debtor-amount { font-size: 14px; font-weight: 800; }
        .debtor-status { font-size: 11px; margin-top: 4px; color: #EF4444; font-weight: 600; }
        .w-85 { width: 85%; }

        .anim-path { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: dash 3s linear forwards; }
        .history-row { opacity: 0.6; }
        .status-badge-healthy { background: #E0E7FF; color: #4F46E5; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        @keyframes dash { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
