"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getRecentTransactions, getCustomers, CustomerBalance, LedgerEntry } from '@/utils/supabase';

type TxnWithCustomer = LedgerEntry & {
  customers: { name: string; phone: string } | null;
};

export default function LedgerPage() {
  const { shop, loading: authLoading } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<'due' | 'history'>('due');
  const [entries, setEntries] = useState<TxnWithCustomer[]>([]);
  const [customers, setCustomers] = useState<CustomerBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    if (!shop) return;
    setLoading(true);
    
    if (view === 'history') {
      const { data } = await getRecentTransactions(shop.id, 100);
      const formatted = (data as any[] ?? []).map(txn => ({
        ...txn,
        customers: Array.isArray(txn.customers) ? txn.customers[0] : txn.customers
      }));
      setEntries(formatted as TxnWithCustomer[]);
    } else {
      const { data } = await getCustomers(shop.id);
      setCustomers(data ?? []);
    }
    
    setLoading(false);
  }, [shop, view]);

  useEffect(() => {
    if (!authLoading && !shop) {
      router.push('/register');
    } else if (shop) {
      loadData();
    }
  }, [shop, authLoading, router, loadData]);

  const fmt = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const filteredEntries = entries.filter(e => 
    e.customers?.name.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && customers.length === 0 && entries.length === 0) {
    return <div className="dash-loading"><div className="spinner" /></div>;
  }

  return (
    <div className="dash-page dash-max anim-1">
      
      <div className="flex-between mb-32 flex-wrap gap-20">
        <div>
          <h1 className="dash-title">{view === 'due' ? 'Due Ledger' : 'Transaction History'}</h1>
          <p className="dash-sub">
            {view === 'due' ? 'Track customer credit limits and overdue payments.' : 'Complete record of all shop transactions.'}
          </p>
        </div>
        <div className="flex-gap-sm">
          <button className="btn-outline">📥 Export PDF</button>
          <Link href="/admin/ledger/new" className="btn-primary">+ Add Entry</Link>
        </div>
      </div>

      <div className="dash-card mb-32">
        <div className="flex-between flex-wrap gap-12 p-12">
          <div className="cust-tabs">
            <button className={`cust-tab ${view === 'due' ? 'active' : ''}`} onClick={() => setView('due')}>Due Ledger</button>
            <button className={`cust-tab ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>History</button>
          </div>
          <div className="flex-gap-sm" style={{ flex: 1, justifyContent: 'flex-end' }}>
            <div className="cust-search-wrap" style={{ maxWidth: '300px', flex: 1 }}>
              <input 
                type="text" 
                placeholder="Search..." 
                className="cust-search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="cust-search-icon">🔍</span>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {view === 'due' ? (
            <table className="cust-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount Due</th>
                  <th>Credit Usage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(c => {
                  const usagePercent = Math.min(Math.round((c.balance_due / c.credit_limit) * 100), 100);
                  const barColor = usagePercent > 80 ? 'fill-red' : usagePercent > 50 ? 'fill-amber' : 'fill-green';
                  
                  return (
                    <tr key={c.customer_id} className="ledger-row-hover" onClick={() => router.push(`/admin/customers/${c.customer_id}`)}>
                      <td>
                        <div className="cust-table-cell-bold">{c.name}</div>
                        <div className="cust-table-cell-muted">{c.phone}</div>
                      </td>
                      <td className="cust-table-cell-due font-700">{fmt(c.balance_due)}</td>
                      <td style={{ minWidth: '150px' }}>
                        <div className="flex-between size-11 mb-4">
                          <span>{usagePercent}% Used</span>
                          <span className="opacity-60">Limit: {fmt(c.credit_limit)}</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className={`progress-bar-fill ${barColor}`} style={{ width: `${usagePercent}%` }} />
                        </div>
                      </td>
                      <td>
                        {c.balance_due > 0 ? (
                          <span className="ledger-overdue-tag">Overdue</span>
                        ) : (
                          <span className="cust-badge-clear">Clear</span>
                        )}
                      </td>
                      <td>
                        <button className="btn-outline py-4 px-12 size-12">Remind</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="cust-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(e => (
                  <tr key={e.id}>
                    <td className="cust-table-cell-muted">{new Date(e.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="cust-table-cell-bold">{e.customers?.name || 'Unknown'}</div>
                    </td>
                    <td className="cust-table-cell-muted">{e.description || '-'}</td>
                    <td>
                      <span className={`m-badge ${e.entry_type === 'purchase' ? 'badge-due' : 'badge-paid'}`}>
                        {e.entry_type.toUpperCase()}
                      </span>
                    </td>
                    <td className={`font-700 ${e.entry_type === 'purchase' ? 'amount-red' : 'amount-green'}`}>
                      {e.entry_type === 'purchase' ? '-' : '+'}{fmt(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
