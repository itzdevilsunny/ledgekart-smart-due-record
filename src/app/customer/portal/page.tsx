"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getCustomerByProfile, getLedgerEntries, LedgerEntry, signOut } from '@/utils/supabase';
import Link from 'next/link';

type CustomerData = {
  id: string;
  name: string;
  phone: string;
  shops: { name: string; phone: string | null };
};

export default function CustomerPortal() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomerData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // MOCK DATA FOR DEMO USER
    if (user.email === 'customer@demo.com') {
      setCustomer({
        id: 'demo-id',
        name: 'Demo Customer',
        phone: '1111111111',
        shops: { name: 'LedgerKart Demo Shop', phone: '9999988888' }
      });
      setEntries([
        { id: '1', amount: 5000, description: 'Initial Inventory Purchase', entry_type: 'purchase', created_at: new Date().toISOString(), customer_id: 'demo-id', shop_id: 'demo-shop' },
        { id: '2', amount: 2000, description: 'Partial Payment', entry_type: 'payment', created_at: new Date().toISOString(), customer_id: 'demo-id', shop_id: 'demo-shop' },
        { id: '3', amount: 1200, description: 'Weekly Supplies', entry_type: 'purchase', created_at: new Date().toISOString(), customer_id: 'demo-id', shop_id: 'demo-shop' },
      ] as LedgerEntry[]);
      setLoading(false);
      return;
    }

    const { data: cust, error: custErr } = await getCustomerByProfile(user.id);
    
    if (custErr || !cust) {
      setLoading(false);
      return;
    }

    setCustomer(cust as CustomerData);
    const { data: ledger } = await getLedgerEntries(cust.id);
    setEntries(ledger || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?role=customer');
      return;
    }

    if (user) {
      // Defer loading to avoid synchronous setState inside effect
      Promise.resolve().then(() => loadCustomerData());
    }
  }, [user, authLoading, router, loadCustomerData]);

  const totalPurchase = entries
    .filter(e => e.entry_type === 'purchase')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  
  const totalPaid = entries
    .filter(e => e.entry_type === 'payment')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  
  const balanceDue = totalPurchase - totalPaid;

  if (authLoading || loading) {
    return <div className="admin-loading"><div className="spinner"></div></div>;
  }

  if (!customer) {
    return (
      <div className="auth-page">
        <div className="auth-card text-center">
          <h1 className="auth-title">No Account Found</h1>
          <p className="auth-sub">We couldn&apos;t find a customer record linked to your account. Please contact your shop owner.</p>
          <button onClick={() => signOut().then(() => router.push('/'))} className="btn-primary btn-full">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <main className="admin-main no-sidebar">
        <div className="dash-page portal-max">
          <header className="dash-header">
            <div>
              <h1 className="dash-title">Welcome, {customer.name} 👋</h1>
              <p className="dash-sub">Customer Portal — <strong>{customer.shops.name}</strong></p>
            </div>
            <button onClick={() => signOut().then(() => router.push('/'))} className="btn-outline">
              🚪 Logout
            </button>
          </header>

          <div className="cust-detail-grid">
            <div className="cust-detail-card portal-card-due">
              <p className="cust-detail-label portal-label-due">Balance Due</p>
              <h2 className="cust-detail-val portal-val-due">₹{balanceDue.toLocaleString('en-IN')}</h2>
              <p className="txn-info-date portal-label-due">Last updated: Just now</p>
            </div>

            <div className="cust-detail-card portal-card-paid">
              <p className="cust-detail-label portal-label-paid">Total Paid</p>
              <h2 className="cust-detail-val portal-val-paid">₹{totalPaid.toLocaleString('en-IN')}</h2>
              <p className="txn-info-date portal-label-paid">Lifetime payments</p>
            </div>
          </div>

          <div className="form-card portal-history-card">
            <div className="txn-history-header flex-between">
              <h3 className="txn-history-title">Transaction History</h3>
              <Link href={`https://wa.me/${customer.shops.phone?.replace(/[^0-9]/g, '')}`} target="_blank" className="btn-primary wa-btn">
                💬 Contact Shop
              </Link>
            </div>
            
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="txn-empty-state">
                        <div className="txn-empty-icon">📒</div>
                        <p className="txn-empty-text">No transactions found in this khata yet.</p>
                      </td>
                    </tr>
                  ) : (
                    entries.map(entry => (
                      <tr key={entry.id}>
                        <td className="txn-info-date font-500">{new Date(entry.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>
                          <div className="txn-info-title">
                            {entry.description || (entry.entry_type === 'purchase' ? 'Purchase' : 'Payment')}
                          </div>
                        </td>
                        <td>
                          <span className={`m-badge ${entry.entry_type === 'purchase' ? 'badge-due' : 'badge-paid'}`}>
                            {entry.entry_type.toUpperCase()}
                          </span>
                        </td>
                        <td className={`txn-amount text-right ${entry.entry_type === 'purchase' ? 'ink' : 'paid'}`}>
                          {entry.entry_type === 'purchase' ? '' : '-'} ₹{Number(entry.amount).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="portal-footer">
            <p className="portal-footer-text">
              PROUDLY MANAGED BY <span className="portal-brand">LEDGERKART</span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
