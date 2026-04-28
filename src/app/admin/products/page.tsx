"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getProducts, Product } from '@/utils/supabase';

export default function ProductsPage() {
  const { shop, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    if (!shop) return;
    const { data } = await getProducts(shop.id);
    setProducts(data ?? []);
    setLoading(false);
  }, [shop]);

  useEffect(() => {
    if (!authLoading && !shop) {
      router.push('/register');
    } else if (shop) {
      load();
    }
  }, [shop, authLoading, router, load]);

  const fmt = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="dash-loading"><div className="spinner" /></div>;

  return (
    <div className="dash-page dash-max anim-1">
      
      <div className="flex-between mb-32 flex-wrap gap-20">
        <div>
          <h1 className="dash-title">Product Catalog</h1>
          <p className="dash-sub">Manage items, pricing, and stock levels.</p>
        </div>
        <div className="flex-gap-sm">
          <button className="btn-outline">📥 Export CSV</button>
          <Link href="/admin/products/new" className="btn-primary">+ Add New Product</Link>
        </div>
      </div>

      <div className="dash-card mb-32">
        <div className="flex-between flex-wrap gap-12 p-12">
          <div className="cust-search-wrap" style={{ flex: 1, minWidth: '300px' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="cust-search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="cust-search-icon">🔍</span>
          </div>
          <div className="flex-gap-sm">
            <button className="btn-outline py-8">Filter</button>
            <button className="btn-outline py-8">Sort</button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>No products found. Start by adding your inventory.</p>
          <Link href="/admin/products/new" className="btn-primary mt-20">Add First Product</Link>
        </div>
      ) : (
        <div className="prod-grid">
          {filtered.map(p => (
            <div key={p.id} className="prod-card">
              <div className="prod-img-box">
                {/* Fallback emoji as image for now */}
                <span style={{ fontSize: '64px' }}>📦</span>
                <span className="prod-badge badge-instock">In Stock</span>
              </div>
              <div className="prod-info">
                <h3 className="prod-name">{p.name}</h3>
                <div className="prod-price-row">
                  <span className="prod-price">{fmt(p.price)}</span>
                  <span className="prod-unit">/ {p.unit}</span>
                </div>
              </div>
              <div className="prod-footer">
                <span className="prod-stock-info">Stock: 450 units</span>
                <button className="prod-edit-btn" title="Edit Product">
                  <span>✏️</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
