"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats, getRecentTransactions, DashboardStats, LedgerEntry } from '@/utils/supabase';

export default function AdminDashboard() {
  const { profile, shop, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<(LedgerEntry & { customers: { name: string } | null })[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (shop?.id) {
        Promise.all([
          getDashboardStats(shop.id),
          getRecentTransactions(shop.id)
        ]).then(([statsRes, txnsRes]) => {
          setStats(statsRes);
          const formatted = (txnsRes.data || []).map(txn => ({
            ...txn,
            customers: Array.isArray(txn.customers) ? txn.customers[0] : txn.customers
          })) as unknown as (LedgerEntry & { customers: { name: string } | null })[];
          setTransactions(formatted);
          setLoading(false);
        }).catch(err => {
          console.error("Dashboard data fetch error:", err);
          setLoading(false);
        });
      } else {
        // No shop found after auth loaded
        Promise.resolve().then(() => setLoading(false));
      }
    }
  }, [shop?.id, authLoading]);

  if (authLoading || (loading && shop?.id)) {
    return (
      <div className="dash-loading">
        <div className="spinner"></div>
        <p>{authLoading ? 'Verifying access...' : 'Initializing your workspace...'}</p>
      </div>
    );
  }

  if (!shop?.id) {
    return (
      <div className="dash-page dash-max anim-1">
        <div className="empty-state py-100">
          <span className="empty-icon">🏪</span>
          <h2>Welcome to LedgerKart</h2>
          <p className="mb-20">It looks like you haven&apos;t set up your shop profile yet.</p>
          <Link href="/admin/settings" className="btn-primary">Set Up My Shop</Link>
        </div>
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
          <p className="dash-sub">Welcome back, {profile?.full_name?.split(' ')[0] || 'Admin'}. Here is your shop&apos;s heartbeat.</p>
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
            <button 
              onClick={() => router.push('/admin/ledger?filter=overdue')}
              className="cust-banner-btn w-full mt-20"
            >
              Send Batch Reminders
            </button>
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


    </div>
  );
}
