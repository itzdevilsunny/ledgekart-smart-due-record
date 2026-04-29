"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getCustomers, CustomerBalance } from '@/utils/supabase';

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export default function CustomersPage() {
  const { shop, loading: authLoading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'due' | 'clear'>('all');

  const load = useCallback(async () => {
    if (!shop) return;
    const { data } = await getCustomers(shop.id);
    setCustomers(data ?? []);
    setLoading(false);
  }, [shop]);

  useEffect(() => {
    if (!authLoading && !shop) {
      router.push('/register');
    } else if (shop) {
      Promise.resolve().then(() => load());
    }
  }, [shop, authLoading, router, load]);

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    if (!matchesSearch) return false;
    
    if (filter === 'due') return c.balance_due > 0;
    if (filter === 'clear') return c.balance_due === 0;
    return true; // 'all'
  });

  if (loading) return <div className="dash-loading"><div className="spinner" /></div>;

  return (
    <div className="cust-mgmt-page">
      
      <div className="cust-header">
        <div>
          <h1 className="cust-title-h1">Customer Management</h1>
          <p className="cust-title-p">Manage your customer database and track their credit history.</p>
        </div>
        <div className="cust-flex-gap">
          <button className="btn-outline cust-br-12">📥 Export Report</button>
          <Link href="/admin/customers/new" className="btn-primary cust-br-12">+ Add Customer</Link>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="cust-stats-row">
        <div className="dash-card cust-p-20">
          <p className="cust-stat-label-row">Total Customers</p>
          <div className="cust-stat-val-row">{customers.length.toLocaleString()}</div>
          <div className="cust-stat-trend-up">↑ 12% this month</div>
        </div>
        <div className="dash-card cust-p-20">
          <p className="cust-stat-label-row">Active Dues</p>
          <div className="cust-stat-val-row">{fmt(customers.reduce((acc, c) => acc + c.balance_due, 0))}</div>
          <div className="cust-stat-trend-down">⚠ {customers.filter(c => c.balance_due > 0).length} customers pending</div>
        </div>
        <div className="dash-card cust-p-20">
          <p className="cust-stat-label-row">Collected Today</p>
          <div className="cust-stat-val-row">₹8,400</div>
          <div className="cust-stat-trend-up">✓ 5 payments received</div>
        </div>
        <div className="dash-card cust-p-20">
          <p className="cust-stat-label-row">Average Credit Term</p>
          <div className="cust-stat-val-row">14 Days</div>
          <div className="cust-stat-standard">Standard cycle</div>
        </div>
      </div>

      {/* Filters and List Section */}
      <div className="dash-card cust-card-no-overflow">
        <div className="cust-filter-row">
          <div className="cust-tabs">
            <button className={`cust-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`cust-tab ${filter === 'due' ? 'active' : ''}`} onClick={() => setFilter('due')}>Due</button>
            <button className={`cust-tab ${filter === 'clear' ? 'active' : ''}`} onClick={() => setFilter('clear')}>Clear</button>
          </div>
          <div className="cust-flex-gap">
            <div className="cust-search-wrap">
              <input 
                type="text" 
                placeholder="Search..." 
                className="cust-search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="cust-search-icon">🔍</span>
            </div>
            <button className="btn-outline cust-search-padding">Filter</button>
            <button className="btn-outline cust-search-padding">Sort</button>
          </div>
        </div>

        <div className="cust-table-wrap">
          <table className="cust-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th className="cust-table-cell-padding">Phone</th>
                <th className="cust-table-cell-padding">Total Due</th>
                <th className="cust-table-cell-padding">Last Payment</th>
                <th className="cust-table-cell-padding">Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.customer_id} onClick={() => router.push(`/admin/customers/${c.customer_id}`)}>
                  <td>
                    <div className="cust-name-row">
                      <div className="cust-avatar">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="cust-table-cell-bold">{c.name}</div>
                        <div className="cust-name-info-sub">Retailer • Mumbai</div>
                      </div>
                    </div>
                  </td>
                  <td className="cust-table-cell-muted">{c.phone}</td>
                  <td className={c.balance_due > 0 ? "cust-table-cell-due" : "cust-table-cell-clear"}>{fmt(c.balance_due)}</td>
                  <td className="cust-table-cell-muted">2 days ago</td>
                  <td className="cust-table-cell-padding">
                    <span className={c.balance_due > 0 ? "cust-badge-overdue" : "cust-badge-clear"}>
                      {c.balance_due > 0 ? 'OVERDUE' : 'CLEAR'}
                    </span>
                  </td>
                  <td className="cust-table-cell-muted">⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Banners */}
      <div className="cust-banner-grid">
        <div className="cust-banner blue">
          <div className="cust-banner-content">
            <h3 className="cust-banner-h3">Automate Reminders</h3>
            <p className="cust-banner-p">Send automatic WhatsApp and SMS alerts to overdue customers and collect 3x faster.</p>
            <button className="cust-banner-btn">Setup WhatsApp Reminders</button>
          </div>
          <div className="cust-banner-icon">💬</div>
        </div>
        <div className="cust-banner green">
          <div className="cust-banner-content">
            <h3 className="cust-banner-h3">Need Help with Onboarding?</h3>
            <p className="cust-banner-p">Our team can help you import your existing data from Excel or other ledger apps.</p>
            <button className="cust-banner-btn">Contact Support</button>
          </div>
          <div className="cust-banner-icon">🎧</div>
        </div>
      </div>

    </div>
  );
}
