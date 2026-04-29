"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo auth-logo">
          <div className="logo-icon">L</div>
          LedgerKart
        </div>

        <h1 className="auth-title">Set New Password</h1>
        <p className="auth-sub">Choose a strong password for your account.</p>

        <form onSubmit={handleUpdate} className="auth-form">
          {error && <div className="auth-error">⚠️ {error}</div>}
          {success && <div className="auth-success" style={{ color: 'var(--success)', padding: '12px', background: 'rgba(0,200,0,0.1)', borderRadius: '8px', marginBottom: '16px' }}>✅ Password updated! Redirecting to login...</div>}

          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading || success}>
            {loading ? <span className="btn-spinner" /> : 'Update Password →'}
          </button>
        </form>
      </div>
    </div>
  );
}
