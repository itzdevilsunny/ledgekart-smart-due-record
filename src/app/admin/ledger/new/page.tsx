"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { addPurchase, getCustomers, CustomerBalance } from '@/utils/supabase';

function NewLedgerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shop } = useAuth();

  const [customers, setCustomers] = useState<CustomerBalance[]>([]);
  const [customerId, setCustomerId] = useState(searchParams.get('customer') ?? '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCustomers = useCallback(async () => {
    if (!shop) return;
    const { data } = await getCustomers(shop.id);
    setCustomers(data ?? []);
  }, [shop]);

  useEffect(() => {
    if (shop) {
      loadCustomers();
    }
  }, [shop, loadCustomers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) {
      setError('Session expired. Please log in again.');
      return;
    }
    if (!customerId) {
      setError('Please select a customer.');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: err } = await addPurchase(
        shop.id, 
        customerId, 
        Number(amount), 
        description || 'Purchase recorded'
      );

      if (err) {
        console.error('Purchase Error:', err);
        setError(err.message || 'Failed to record purchase. Please try again.');
        setLoading(false);
        return;
      }

      router.push(`/admin/customers/${customerId}`);
    } catch (err: any) {
      console.error('Unexpected Error:', err);
      setError('An unexpected error occurred. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <Link href="/admin/ledger" className="back-link">← Ledger</Link>
          <h1 className="dash-title">Record Purchase</h1>
          <p className="dash-sub">Add a new purchase/credit entry</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="entry-customer">Select Customer *</label>
            <select
              id="entry-customer"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              required
            >
              <option value="">-- Choose Customer --</option>
              {customers.map(c => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.name} ({c.phone}) — Due: ₹{c.balance_due}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="entry-amount">Amount (₹) *</label>
            <input
              id="entry-amount"
              type="number"
              placeholder="e.g. 850"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="entry-desc">Description / Items</label>
            <input
              id="entry-desc"
              type="text"
              placeholder="e.g. Rice 10kg, Dal 2kg"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : '🛒 Record Purchase'}
            </button>
            <Link href="/admin/customers" className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewLedgerEntryPage() {
  return (
    <React.Suspense fallback={<div className="dash-loading"><div className="spinner" /></div>}>
      <NewLedgerForm />
    </React.Suspense>
  );
}
