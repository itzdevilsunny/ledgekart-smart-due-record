"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Get the site URL for the redirect link
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage('Password reset link sent! Please check your email.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="logo auth-logo">
          <div className="logo-icon">L</div>
          LedgerKart
        </Link>

        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-sub">Enter your email and we&apos;ll send you a reset link.</p>

        <form onSubmit={handleReset} className="auth-form">
          {error && <div className="auth-error">⚠️ {error}</div>}
          {message && <div className="auth-success" style={{ color: 'var(--success)', padding: '12px', background: 'rgba(0,200,0,0.1)', borderRadius: '8px', marginBottom: '16px' }}>✅ {message}</div>}

          <div className="form-group">
            <label htmlFor="reset-email">Email Address</label>
            <input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Send Reset Link →'}
          </button>
        </form>

        <p className="auth-switch">
          Remember your password? <Link href="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
