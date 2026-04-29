"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats, getRecentTransactions } from '@/utils/supabase';

interface DashboardStats {
  totalDue: number;
  totalCollected: number;
  pendingCustomers: number;
  totalCustomers: number;
}

export default function AdminDashboard() {
  const { profile, shop } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (shop?.id) {
      Promise.all([
        getDashboardStats(shop.id),
        getRecentTransactions(shop.id)
      ]).then(([statsRes, txnsRes]) => {
        setStats(statsRes);
        setTransactions(txnsRes.data || []);
        setLoading(false);
      });
    }
  }, [shop?.id]);

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="spinner"></div>
        <p>Initializing your workspace...</p>
      </div>
    );
  }

  const fmt = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="dash-page dash-max anim-1">
      
      {/* Premium Minimal Header */}
      <header className="flex-between mb-40 flex-wrap gap-20">
        <div>
          <h1 className="dash-title">Command Center</h1>
          <p className="dash-sub">Welcome back, {profile?.full_name?.split(' ')[0] || 'Admin'}. Here is your shop's heartbeat.</p>
        </div>
        <div className="flex-gap-sm">
          <Link href="/admin/ledger/new" className="btn-primary">+ New Entry</Link>
          <Link href="/admin/customers/new" className="btn-outline">Add Customer</Link>
        </div>
      </header>

      {/* Hero Stats Grid - Balanced and Clean */}
      <div className="stats-grid mb-40">
        <div className="stat-card stat-blue">
          <div className="stat-icon">💰</div>
          <p className="stat-label">Total Revenue</p>
          <div className="stat-val">{fmt((stats?.totalCollected || 0) + (stats?.totalDue || 0))}</div>
          <p className="stat-hint">Lifetime transactions</p>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-icon">📉</div>
          <p className="stat-label">Pending Dues</p>
          <div className="stat-val">{fmt(stats?.totalDue || 0)}</div>
          <p className="stat-hint">Across all customers</p>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">✅</div>
          <p className="stat-label">Collection Rate</p>
          <div className="stat-val">
            {stats?.totalCollected ? Math.round((stats.totalCollected / ((stats.totalCollected || 0) + (stats.totalDue || 0))) * 100) : 0}%
          </div>
          <p className="stat-hint">Payment efficiency</p>
        </div>
        <div className="stat-card stat-amber">
          <div className="stat-icon">👥</div>
          <p className="stat-label">Active Clients</p>
          <div className="stat-val">{stats?.totalCustomers || 0}</div>
          <p className="stat-hint">Registered in khata</p>
        </div>
      </div>

      <div className="dash-main-grid">
        {/* Simple Recent Activity */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Recent Activity</h2>
            <Link href="/admin/ledger" className="view-all">View All</Link>
          </div>
          <div className="txn-list">
            {transactions.length > 0 ? (
              transactions.slice(0, 6).map((txn) => (
                <div key={txn.id} className="txn-item">
                  <div className="txn-left">
                    <div className={`txn-avatar ${txn.entry_type === 'purchase' ? 'avatar-red' : 'avatar-green'}`}>
                      {txn.customers?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <div className="txn-name">{txn.customers?.name}</div>
                      <div className="txn-desc">{txn.description || (txn.entry_type === 'purchase' ? 'Credit Purchase' : 'Payment Received')}</div>
                    </div>
                  </div>
                  <div className="txn-right">
                    <div className={`txn-amount ${txn.entry_type === 'purchase' ? 'amount-red' : 'amount-green'}`}>
                      {txn.entry_type === 'purchase' ? '-' : '+'}{fmt(txn.amount)}
                    </div>
                    <div className="txn-time">{new Date(txn.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📂</span>
                <p>No transactions yet. Start by adding a customer.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links / Sidebar Widget */}
        <div className="flex-col-gap">
          <div className="stat-card insight-card">
            <h3 className="insight-title">Pro Insight</h3>
            <p className="insight-text">You have {stats?.pendingCustomers || 0} customers with overdue balances. Consider sending WhatsApp reminders today.</p>
            <button className="cust-banner-btn w-full mt-20">Send Batch Reminders</button>
          </div>
          
          <div className="dash-section">
            <div className="dash-section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="qa-grid">
              <Link href="/admin/products" className="qa-btn">
                <span>📦</span>
                Products
              </Link>
              <Link href="/admin/reports" className="qa-btn">
                <span>📊</span>
                Reports
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .insight-card { background: var(--accent); color: white; padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
        .insight-title { font-size: 1.125rem; font-weight: 800; margin-bottom: 4px; }
        .insight-text { font-size: 0.875rem; opacity: 0.8; }
        .qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 24px; }
      `}</style>
    </div>
  );
}
