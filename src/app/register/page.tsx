"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, createShop } from '@/utils/supabase';

function getErrorMessage(raw: string): { msg: string; hint?: string } {
  const lower = raw.toLowerCase();
  if (lower.includes('rate limit') || lower.includes('email rate')) {
    return {
      msg: 'Too many signup attempts. Please wait a few minutes and try again.',
      hint: 'TIP: In Supabase → Authentication → Providers → Email, disable "Confirm email" so you can sign up instantly during development.',
    };
  }
  if (lower.includes('already registered') || lower.includes('user already')) {
    return { msg: 'An account with this email already exists.', hint: 'Try logging in instead.' };
  }
  if (lower.includes('password')) {
    return { msg: 'Password must be at least 8 characters.' };
  }
  return { msg: raw };
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorHint, setErrorHint] = useState('');

  // Step 1: Account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Shop details
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');

  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('admin');

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorHint('');
    setLoading(true);

    const { data, error: authError } = await signUp(email, password, fullName, phone, role);

    if (authError) {
      const { msg, hint } = getErrorMessage(authError.message);
      setError(msg);
      setErrorHint(hint ?? '');
      setLoading(false);
      return;
    }

    if (data.user) {
      setUserId(data.user.id);
      if (role === 'admin') {
        setStep(2);
      } else {
        router.push('/customer/portal');
      }
    } else if (data.session === null) {
      // Email confirmation is ON — user exists but needs to confirm
      setError('');
      setErrorHint('');
      setStep(2); // still advance — they can confirm email later
    }

    setLoading(false);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorHint('');
    setLoading(true);

    const { error: shopError } = await createShop(userId, { name: shopName, address: shopAddress, phone: shopPhone });

    if (shopError) {
      const { msg, hint } = getErrorMessage(shopError.message);
      setError(msg);
      setErrorHint(hint ?? '');
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="logo auth-logo">
          <div className="logo-icon">L</div>
          LedgerKart
        </Link>

        <div className="role-toggle mb-24">
          <button 
            type="button"
            className={`role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            🏪 Admin
          </button>
          <button 
            type="button"
            className={`role-tab ${role === 'customer' ? 'active' : ''}`}
            onClick={() => setRole('customer')}
          >
            👤 Customer
          </button>
        </div>

        {role === 'admin' && (
          <div className="auth-steps">
            <div className={`auth-step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className="auth-step-line"></div>
            <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>
        )}

        {step === 1 ? (
          <>
            <h1 className="auth-title">Create Your Account</h1>
            <p className="auth-sub">Step 1 of 2 — Your personal details</p>

            <form onSubmit={handleStep1} className="auth-form">
              {error && (
                <div className="auth-error">
                  <strong>⚠️ {error}</strong>
                  {errorHint && <div className="auth-error-hint">{errorHint}</div>}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Rajan Gupta"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone">Mobile Number</label>
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="+91 98765 XXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : 'Continue →'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="auth-title">Set Up Your Shop</h1>
            <p className="auth-sub">Step 2 of 2 — Your shop details</p>

            <form onSubmit={handleStep2} className="auth-form">
              {error && (
                <div className="auth-error">
                  <strong>⚠️ {error}</strong>
                  {errorHint && <div className="auth-error-hint">{errorHint}</div>}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="shopName">Shop Name</label>
                <input
                  id="shopName"
                  type="text"
                  placeholder="Gupta Kirana Store"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="shopAddress">Shop Address</label>
                <input
                  id="shopAddress"
                  type="text"
                  placeholder="Shop No. 5, Main Market, Delhi"
                  value={shopAddress}
                  onChange={e => setShopAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="shopPhone">Shop Phone</label>
                <input
                  id="shopPhone"
                  type="tel"
                  placeholder="+91 11 2345 6789"
                  value={shopPhone}
                  onChange={e => setShopPhone(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary btn-full" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : '🚀 Launch My Shop'}
              </button>
            </form>
          </>
        )}

        <p className="auth-switch">
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
