"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createCustomer } from '@/utils/supabase';

export default function NewCustomerPage() {
  const router = useRouter();
  const { shop } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [creditLimit, setCreditLimit] = useState('10000');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    setError('');
    setLoading(true);

    const { data, error: err } = await createCustomer(shop.id, name, phone, Number(creditLimit));

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    router.push(`/admin/customers/${data?.id}`);
  };

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <Link href="/admin/customers" className="back-link">← Customers</Link>
          <h1 className="dash-title">Add New Customer</h1>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="cust-name">Customer Name *</label>
            <input
              id="cust-name"
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cust-phone">Mobile Number *</label>
            <input
              id="cust-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cust-limit">Credit Limit (₹)</label>
            <input
              id="cust-limit"
              type="number"
              placeholder="10000"
              value={creditLimit}
              onChange={e => setCreditLimit(e.target.value)}
              min="0"
            />
            <span className="form-hint">Maximum credit allowed for this customer</span>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : '✅ Add Customer'}
            </button>
            <Link href="/admin/customers" className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
