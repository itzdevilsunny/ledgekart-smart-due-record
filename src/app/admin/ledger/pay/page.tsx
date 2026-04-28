"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { addPayment, getCustomers, CustomerBalance } from '@/utils/supabase';

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { shop } = useAuth();

  const [customers, setCustomers] = useState<CustomerBalance[]>([]);
  const [customerId, setCustomerId] = useState(searchParams.get('customer') ?? '');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'upi' | 'card' | 'other'>('cash');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCustomer = customers.find(c => c.customer_id === customerId);

  const loadCustomers = useCallback(async () => {
    if (!shop) return;
    const { data } = await getCustomers(shop.id);
    setCustomers(data ?? []);
  }, [shop]);

  useEffect(() => { 
    if (shop) {
      Promise.resolve().then(() => loadCustomers());
    }
  }, [loadCustomers, shop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop || !customerId) return;
    setError('');
    setLoading(true);

    const { error: err } = await addPayment(shop.id, customerId, Number(amount), method);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    router.push(`/admin/customers/${customerId}`);
  };

  return (
    <div className="dash-page">
      <div className="flex-between mb-32">
        <div className="nav-btn-container">
          <button onClick={() => router.back()} className="nav-btn nav-btn-back">Back</button>
          <h1 className="size-24 font-800">Record Payment</h1>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="pay-customer">Select Customer *</label>
            <select
              id="pay-customer"
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

          {selectedCustomer && (
            <div className="pay-balance-hint">
              Current balance due: <strong className="text-red">₹{selectedCustomer.balance_due}</strong>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="pay-amount">Payment Amount (₹) *</label>
            <input
              id="pay-amount"
              type="number"
              placeholder="e.g. 2000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <div className="method-btns">
              {(['cash', 'upi', 'card', 'other'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  className={`method-btn ${method === m ? 'active' : ''}`}
                  onClick={() => setMethod(m)}
                >
                  {m === 'cash' ? '💵' : m === 'upi' ? '📱' : m === 'card' ? '💳' : '💰'} {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : '💰 Record Payment'}
            </button>
            <Link href="/admin/customers" className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RecordPaymentPage() {
  return (
    <React.Suspense fallback={<div className="dash-loading"><div className="spinner" /></div>}>
      <PaymentForm />
    </React.Suspense>
  );
}
