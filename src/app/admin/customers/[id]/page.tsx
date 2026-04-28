"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCustomerById, getLedgerEntries, LedgerEntry, CustomerBalance } from '@/utils/supabase';

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function CustomerDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerBalance | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [c, e] = await Promise.all([
      getCustomerById(id as string),
      getLedgerEntries(id as string),
    ]);
    setCustomer(c.data);
    setEntries(e.data ?? []);
    setLoading(false);
  }, [id]);

  useEffect(() => { 
    if (id) {
      Promise.resolve().then(() => load());
    }
  }, [load, id]);

  if (loading) return <div className="dash-loading"><div className="spinner" /></div>;
  if (!customer) return <div className="dash-page"><p>Customer not found.</p></div>;

  return (
    <div className="dash-page">
      {/* Navigation Header */}
      <div className="flex-between mb-32">
        <div className="nav-btn-container">
          <button onClick={() => router.back()} className="nav-btn nav-btn-back">Back</button>
          <h1 className="size-24 font-800">Customer Statement</h1>
        </div>
        <div className="flex-col-gap-sm text-right">
          <div className="size-11 muted-text uppercase font-700 letter-spacing-1">Customer Profile</div>
          <div className="font-600 size-13 text-indigo">ID: {id.slice(0, 8).toUpperCase()}</div>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="flex-between mb-32 bg-white p-24 radius-16 shadow-sm border-light">
        <div>
          <h2 className="size-28 font-900 mb-4">{customer.name}</h2>
          <div className="flex-gap-sm align-center">
            <span className="size-14 font-600 text-indigo">{customer.phone}</span>
            <span className="size-12 muted-text">•</span>
            <span className="size-12 muted-text font-600">ID: {id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
        <div className="cust-flex-gap">
          <Link href={`/admin/ledger/new?customer=${id}`} className="btn-primary ink-bg">
            + Record Credit
          </Link>
          <Link href={`/admin/ledger/pay?customer=${id}`} className="btn-primary">
            + Payment
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="cust-detail-grid mb-40">
        <div className="cust-detail-card">
          <p className="cust-detail-label">Current Balance</p>
          <div className={`cust-detail-val ${customer.balance_due > 0 ? 'due' : 'clear'}`}>{fmt(customer.balance_due)}</div>
          <div className="size-11 mt-8 muted-text">Amount yet to be collected</div>
        </div>
        <div className="cust-detail-card">
          <p className="cust-detail-label">Lifetime Paid</p>
          <div className="cust-detail-val accent">{fmt(customer.total_paid)}</div>
          <div className="size-11 mt-8 muted-text">Total payments received</div>
        </div>
        <div className="cust-detail-card">
          <p className="cust-detail-label">Credit Limit</p>
          <div className="cust-detail-val ink">{fmt(customer.credit_limit)}</div>
          <div className="size-11 mt-8 muted-text">Maximum allowed credit</div>
        </div>
      </div>

      <div className="txn-history-section">
        <div className="txn-history-header">
          <h2 className="txn-history-title">Transaction History</h2>
        </div>

        {entries.length === 0 ? (
          <div className="txn-empty-state">
            <div className="txn-empty-icon">📒</div>
            <p className="txn-empty-text">No transactions recorded for this customer.</p>
          </div>
        ) : (
          <div className="txn-list">
            {entries.map(e => (
              <div key={e.id} className="txn-item">
                <div className="txn-item-left">
                  <div className={`txn-icon ${e.entry_type === 'purchase' ? 'purchase' : 'payment'}`}>
                    {e.entry_type === 'purchase' ? '🛒' : '💰'}
                  </div>
                  <div>
                    <div className="txn-info-title">
                      {e.description || (e.entry_type === 'purchase' ? 'Purchase' : 'Payment')}
                    </div>
                    <div className="txn-info-date">{fmtDate(e.created_at)}</div>
                  </div>
                </div>
                <div className="txn-item-right">
                  <div className={`txn-amount ${e.entry_type === 'purchase' ? 'purchase' : 'payment'}`}>
                    {e.entry_type === 'purchase' ? '' : '-'} {fmt(e.amount)}
                  </div>
                  <span className={`m-badge ${e.entry_type === 'purchase' ? 'badge-due' : 'badge-paid'} txn-badge`}>
                    {e.entry_type.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
