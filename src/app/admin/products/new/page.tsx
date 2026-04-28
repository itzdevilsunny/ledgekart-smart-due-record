"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createProduct } from '@/utils/supabase';

export default function NewProductPage() {
  const router = useRouter();
  const { shop } = useAuth();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    setError('');
    setLoading(true);

    const { data, error: err } = await createProduct(shop.id, name, Number(price), unit);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    router.push('/admin/products');
  };

  return (
    <div className="dash-page dash-max anim-1">
      <div className="mb-32">
        <Link href="/admin/products" className="back-link">← Product Catalog</Link>
        <h1 className="dash-title mt-8">Add New Product</h1>
        <p className="dash-sub">Enter the product details below to add it to your inventory.</p>
      </div>

      <div className="form-card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="prod-name">Product Name *</label>
            <input
              id="prod-name"
              type="text"
              placeholder="e.g. Premium Basmati Rice"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid-2-col gap-20">
            <div className="form-group">
              <label htmlFor="prod-price">Price (₹) *</label>
              <input
                id="prod-price"
                type="number"
                placeholder="100"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="prod-unit">Unit *</label>
              <select
                id="prod-unit"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                required
                className="cust-search-input"
                style={{ height: '46px' }}
              >
                <option value="kg">kilogram (kg)</option>
                <option value="gram">gram (g)</option>
                <option value="liter">liter (L)</option>
                <option value="pcs">pieces (pcs)</option>
                <option value="box">box</option>
                <option value="pack">pack</option>
              </select>
            </div>
          </div>

          <div className="form-actions mt-32">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : '✅ Add Product'}
            </button>
            <Link href="/admin/products" className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        .grid-2-col { display: grid; grid-template-columns: 1fr 1fr; }
        select { background: #F9FAFB; border: 1px solid var(--border); border-radius: 12px; padding: 0 16px; width: 100%; outline: none; transition: all 0.2s; }
        select:focus { border-color: var(--accent); background: #fff; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
      `}</style>
    </div>
  );
}
