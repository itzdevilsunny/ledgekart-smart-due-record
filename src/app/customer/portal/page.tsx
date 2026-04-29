"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getCustomerByProfile, getLedgerEntries, LedgerEntry, signOut, linkCustomerByEmail } from '@/utils/supabase';
import Link from 'next/link';
import { Download, CreditCard, MessageSquare, LogOut, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type CustomerData = {
  id: string;
  name: string;
  phone: string;
  shops: { 
    name: string; 
    phone: string | null; 
    address: string | null;
    upi_id: string | null;
  };
};

export default function CustomerPortal() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);

  const loadCustomerData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // MOCK DATA FOR DEMO USER
    if (user.email === 'customer@demo.com') {
      setCustomer({
        id: 'demo-id',
        name: 'Demo Customer',
        phone: '1111111111',
        shops: { 
          name: 'LedgerKart Demo Shop', 
          phone: '9999988888',
          address: '123 Market Street, New Delhi',
          upi_id: 'demo@upi'
        }
      });
      setEntries([
        { id: '1', amount: 5000, description: 'Initial Inventory Purchase', entry_type: 'purchase', created_at: new Date().toISOString(), customer_id: 'demo-id', shop_id: 'demo-shop' },
        { id: '2', amount: 2000, description: 'Partial Payment', entry_type: 'payment', created_at: new Date().toISOString(), customer_id: 'demo-id', shop_id: 'demo-shop' },
        { id: '3', amount: 1200, description: 'Weekly Supplies', entry_type: 'purchase', created_at: new Date().toISOString(), customer_id: 'demo-id', shop_id: 'demo-shop' },
      ] as LedgerEntry[]);
      setLoading(false);
      return;
    }

    const { data: initialCust, error: custErr } = await getCustomerByProfile(user.id);
    let cust = initialCust;
    
    // If not found by profile ID, try linking by email
    if ((custErr || !cust) && user.email) {
      const { data: linkedCust, error: linkErr } = await linkCustomerByEmail(user.id, user.email);
      if (!linkErr && linkedCust) {
        cust = linkedCust;
      }
    }

    if (!cust) {
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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('LedgerKart Statement', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Customer: ${customer.name}`, 14, 32);
    doc.text(`Shop: ${customer.shops.name}`, 14, 38);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44);

    const tableData = entries.map(e => [
      new Date(e.created_at).toLocaleDateString(),
      e.description || (e.entry_type === 'purchase' ? 'Purchase' : 'Payment'),
      e.entry_type.toUpperCase(),
      `INR ${Number(e.amount).toLocaleString('en-IN')}`
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Date', 'Description', 'Type', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`LedgerKart_Statement_${customer.name}.pdf`);
  };

  const shopUPI = customer.shops.upi_id || 'shop@upi';
  const upiLink = `upi://pay?pa=${shopUPI}&pn=${encodeURIComponent(customer.shops.name)}&am=${balanceDue}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}&margin=10`;

  return (
    <div className="admin-layout">
      <main className="admin-main no-sidebar">
        <div className="dash-page portal-max">
          <header className="dash-header">
            <div>
              <h1 className="dash-title">Welcome, {customer.name} 👋</h1>
              <div className="flex-gap-sm align-center">
                <p className="dash-sub">Customer Portal — <strong>{customer.shops.name}</strong></p>
                {customer.shops.address && (
                  <span className="shop-address-badge">📍 {customer.shops.address}</span>
                )}
              </div>
            </div>
            <div className="flex-gap-sm">
              <button onClick={downloadPDF} className="btn-outline flex-center gap-8 size-13">
                <Download size={18} /> Statement
              </button>
              <button 
                onClick={() => signOut().then(() => router.push('/'))} 
                className="btn-ghost text-red"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </header>

          {balanceDue > 0 && (
            <div className="alert-banner mb-24">
              <div className="flex-center gap-12">
                <ShieldCheck className="text-primary" />
                <span>You have a pending balance of <strong>₹{balanceDue.toLocaleString('en-IN')}</strong>. Please clear it to maintain your credit limit.</span>
              </div>
              <button onClick={() => setShowPayModal(true)} className="btn-primary btn-sm flex-center gap-8">
                <CreditCard size={16} /> Pay Now
              </button>
            </div>
          )}

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
              <div className="flex-gap-sm">
                <Link href={`https://wa.me/${customer.shops.phone?.replace(/[^0-9]/g, '')}`} target="_blank" className="btn-primary wa-btn flex-center gap-8">
                  <MessageSquare size={18} /> Contact Shop
                </Link>
              </div>
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

      {showPayModal && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Scan to Pay</h2>
            <p className="modal-sub">Scan this QR with any UPI app (GPay, PhonePe, Paytm)</p>
            
            <div className="qr-container mb-24">
              <Image 
                src={qrUrl} 
                alt="Payment QR" 
                width={200} 
                height={200} 
                className="qr-img"
                priority
              />
              <div className="qr-amount">₹{balanceDue.toLocaleString('en-IN')}</div>
            </div>

            <div className="flex-col-gap">
              <a href={upiLink} className="btn-primary btn-full">Open in UPI App</a>
              <button onClick={() => setShowPayModal(false)} className="btn-ghost">Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .alert-banner { background: rgba(79, 70, 229, 0.05); border: 1px solid rgba(79, 70, 229, 0.2); padding: 16px 24px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .text-primary { color: var(--primary); }
        .btn-ghost { background: transparent; border: none; padding: 8px; cursor: pointer; color: #666; display: flex; align-items: center; }
        .text-red { color: #ef4444; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content { background: white; padding: 32px; border-radius: 24px; max-width: 400px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .modal-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
        .modal-sub { color: #666; font-size: 0.875rem; margin-bottom: 24px; }
        
        .qr-container { background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; }
        .qr-img { width: 200px; height: 200px; margin: 0 auto 16px; }
        .qr-amount { font-size: 1.25rem; font-weight: 700; color: var(--ink); }
        
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .gap-8 { gap: 8px; }
        .gap-12 { gap: 12px; }
        .shop-address-badge { background: #F3F4F6; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; color: #6B7280; }
        .wa-btn { background: #25D366 !important; border: none !important; }
        .wa-btn:hover { background: #128C7E !important; }
      `}</style>
    </div>
  );
}
